import React from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from '../components/Cart';

const Home = () => {
    return (
        <div className="container-fluid d-flex flex-row flex-wrap justify-content-around">
            <Cart />
            <CategoryMenu /> 
            <ProductList />
        </div>
    )
}

export default Home;