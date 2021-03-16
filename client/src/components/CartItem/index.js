import React from 'react';
import { REMOVE_FROM_CART } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";
import { useDispatch } from 'react-redux';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

    const removeFromCart = item => {
        dispatch({
          type: REMOVE_FROM_CART,
          _id: item._id
        });
        idbPromise('cart', 'delete', { ...item });
    };

  return (
    <div className="d-flex cart-item py-2">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div className="d-flex justify-content-between">
        <div>{item.name}, ${item.price} </div>
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
      </div>
    </div>
  );
}

export default CartItem;