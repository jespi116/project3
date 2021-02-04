import React from 'react';
import { Link } from "react-router-dom";

const ProfileProducts = (item) => {
    console.log(item)

    const {
        image,
        name,
        _id,
        price,
        quantity
      } = item;

    return(
    <div className="card px-1 py-1">
        <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/uploads/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <span>${price}</span>
      </div>
      <button onClick={console.log('addToCart')}>Add to cart</button>
    </div>
    )
}

export default ProfileProducts;