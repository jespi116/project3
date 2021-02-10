import React from "react";
import { Link } from "react-router-dom";

import { useQuery } from '@apollo/react-hooks';
import { QUERY_ME } from "../utils/queries";

function OrderHistory() {
  const { data } = useQuery(QUERY_ME);
  let user;

  if (data) {
    user = data.me;
  }

  return (
    <>
      <div className="container my-1">
        <Link className="link" to="/">
          ← Back to Products
          </Link>

        {user ? (
          <>
            <h2 className="my-4">Order History for {user.username}:</h2>
            {user.orders.map((order) => (
              <div key={order._id} className="mb-5">
                <h3>{new Date(parseInt(order.purchaseDate)).toLocaleDateString()}</h3>
                <div className="flex-row">
                  {order.products.map(({ _id, image, name, price }, index) => (
                    <div key={index} className="card px-1 py-1">

                        <img
                          alt={name}
                          src={`/uploads/${image}`}
                        />
                        <p>{name}</p>
      
                      <div>
                        <span>${price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : null}

      </div>

    </>)

};

export default OrderHistory;
