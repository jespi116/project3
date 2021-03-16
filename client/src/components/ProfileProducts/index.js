import React from 'react';
import { Link } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { QUERY_PRODUCTS, QUERY_ME } from '../../utils/queries';
import { REMOVE_PRODUCT } from '../../utils/mutations';
import { idbPromise } from "../../utils/helpers";
import { useDispatch, useSelector } from 'react-redux';

const ProfileProducts = (item) => {
    
    const {
        image,
        name,
        _id,
        price,
        category,
        userParam
      } = item;

  const dispatch = useDispatch();

  const state = useSelector(state => state);

  const { cart } = state;

      const addToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === _id)
        if (itemInCart) {
          dispatch({
            type: UPDATE_CART_QUANTITY,
            _id: _id,
            purchaseQuantity: 1
          });
          idbPromise('cart', 'put', {
            ...itemInCart,
            purchaseQuantity: 1
          });
        } else {
          dispatch({
            type: ADD_TO_CART,
            product: { ...item, purchaseQuantity: 1 }
          });
          idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
        }
      };

      const [removeProduct, { error }] = useMutation(REMOVE_PRODUCT, {
        update(cache, { data: { removeProduct } }) {
          try {
            // could potentially not exist yet, so wrap in a try...catch
            const { products } = cache.readQuery({ query: QUERY_PRODUCTS });
            cache.writeQuery({
              query: QUERY_PRODUCTS,
              data: { products: [removeProduct, ...products] }
            });
          } catch (e) {
            console.log(e + error);
          }
      
          // update me object's cache, appending new Product to the end of the array
          const { me } = cache.readQuery({ query: QUERY_ME });
          cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, products: [...me.products, removeProduct] } }
          });
        }
      });

      const deletePro = async event => {
        event.preventDefault();

        try{
          await removeProduct({
            variables: {
              _id
            }
          });
          window.location.reload();
        } catch(e) {
          console.log(e);
        }
      };

    return(
    <div className="card m-3 col-3">
        <Link to={`/products/${_id}`}>
        <img
          className="image-fluid card-img"
          alt={name}
          src={`/uploads/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>Category: {category.name}</div>
      <div>
        <span>${price}</span>
      </div>
      {userParam && (
        <button className="btn p-1 mb-2" onClick={addToCart}>Add to cart</button>
      )}
      {!userParam && (
        <button className="btn p-1 m-2" onClick={deletePro}>Delete Listing</button>
      )}
    </div>
    )
}

export default ProfileProducts;