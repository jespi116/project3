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

  const [ soldBtn, setSoldBtn ] = useState(false);

  const [addFollow] = useMutation(ADD_FOLLOW);

  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};
  // redirect to personal profile page if username is the logged-in user's

  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }  

  if (loading) {
    return <h1 className="jumbotron jumbotrom-fluid container">Loading...</h1>;
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

  function forSale() {
    setSoldBtn(false);
    return soldBtn;
  }

  function sold() {
    setSoldBtn(true);
    return soldBtn;
  }

  function filterProducts() {
    if (!soldBtn) {
      return user.products.filter(product => product.sold === false);
    }

    return user.products.filter(product => (product.sold === true));
  }

  return (
    <div className="container-fluid ">
      <div className="flex-row mb-3">
        <h2>
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {userParam && (
          <button className="btn" onClick={handleClick}>
            Add Follow
          </button>
        )}
      </div>
      
        {!userParam && (
      <div>
        <h5 className="mt-2">Choose which of your products you'd like to view!</h5>
        <div>
        <button className="btn m-3" onClick={forSale} >Products For Sale</button>
        <button className="btn m-3" onClick={sold} >Sold Products</button>
        </div>
      </div>
      )}
      <div className="d-flex flex-row flex-wrap">
        <div className="col-8">
          <h2>{userParam ? "User's" : "Your"} Products:</h2>
            {user.products?.length ? (
              <div className="d-flex flex-row flex-wrap text-center">
              {filterProducts().map(product => (
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
          ) : ( <h3>No Products To Show Currently!</h3>)}
          { loading ? 
          <img src={spinner} alt="loading" />: null}
        </div>
        <div className="col-4">
            <h5>
              {user.username}'s Following List
            </h5>
          <FollowList
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
