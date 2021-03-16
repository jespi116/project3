import React from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from '../components/Cart';

const Home = () => {
    return (
        <div className="container-fluid">
            <Cart />
            <div className="row">
                <CategoryMenu /> 
                <ProductList />
            </div>
        </div>
    )
}

export default Home;