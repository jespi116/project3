import React from 'react';
import { Link } from "react-router-dom";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
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

    return(
    <div className="card px-2 py-2">
        <Link to={`/products/${_id}`}>
        <img
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
        <button onClick={addToCart}>Add to cart</button>
      )}
    </div>
    )
}

export default ProfileProducts;