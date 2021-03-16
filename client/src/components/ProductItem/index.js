import React from "react";
import { Link } from "react-router-dom";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";
import { useDispatch, useSelector } from 'react-redux';

function ProductItem(item) {

  
  const {
    image,
    name,
    _id,
    price,
    category,
    seller
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
        purchaseQuantity:  1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity:  1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  };

  return (
    <div className="col-md-4">
      <div className="mx-2 my-4 p-3 card text-center">
        <Link to={`/products/${_id}`}>
          <img
          className='image-fluid card-img'
            alt={name}
            src={`/uploads/${image}`}
          />
          <p className="mt-3">{name}</p>
        </Link>
        <Link to={`/profile/${seller.username}`}>Seller:<br/>{seller.username}</Link>
        <div className="my-2">Category:<br/>{category.name}</div>
        <div>
          <span>${price}</span>
        </div>
        <button className="btn btn2 border my-2" onClick={addToCart}>Add to cart</button>
      </div>
    </div>
  );
}

export default ProductItem;
