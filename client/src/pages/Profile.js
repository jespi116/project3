import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import Auth from '../utils/auth';
import ProfileProducts from '../components/ProfileProducts';
import ProductForm from '../components/ProductForm';
import FollowList from '../components/FollowList';
import spinner from "../assets/spinner.gif"
import { ADD_FOLLOW } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Cart from '../components/Cart';

const Profile = () => {

  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });
  
  const [addFollow] = useMutation(ADD_FOLLOW);


  const user = data?.me || data?.user || {};
  // redirect to personal profile page if username is the logged-in user's

  const [products, setProducts] = useState([]);
  
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }
  

  const handleClick = async () => {
    try {
      await addFollow({
        variables: { followId: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const forSale = ()=> {
    setProducts(user.products);
  }

  const soldProd= () => {
    setProducts(user.sold);
  }

  function isSale() {
    if(products === user.products){
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Follow
          </button>
        )}
      </div>
      
        {!userParam && (
      <div>
        Choose which of your products you'd like to view!
        <div>
        <button onClick={forSale}>Products For Sale</button>
        <button onClick={soldProd}>Sold Products</button>
        </div>
      </div>
      )}
      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8 my-2">
          <h2>{userParam ? "User's" : "Your"} Products:</h2>
            {user.products.length ? (
              <div className="flex-row">
              {products?.map(product => (
                <ProfileProducts
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  seller={product.seller}
                  userParam={userParam}
                />
              ))}
              </div>
          ) : ( <h3>No Products Currently For Sale!</h3>)}
          { loading ? 
          <img src={spinner} alt="loading" />: null}
        </div>
        <div className="col-12 col-lg-3 mb-3">
          <FollowList
            username={user.username}
            following={user.following}
          />
        </div>
      </div>
      {!userParam && (
      <div className="mb-3">
          <ProductForm />
      </div>
      )}
      <Cart /> 
    </div>
  );
};

export default Profile;
