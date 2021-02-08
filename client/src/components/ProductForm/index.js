import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { ADD_PRODUCT } from '../../utils/mutations';
import { QUERY_PRODUCTS, QUERY_ME, QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES } from '../../utils/actions';
import { useSelector, useDispatch } from 'react-redux';
import { idbPromise } from "../../utils/helpers";

const ProductForm = () => {
    const [formState, setFormState] = useState({ name: '', price: '', category: '', description: '' });

    const state = useSelector(state => state);
    const dispatch = useDispatch();

    const { categories } = state;

    const { loading, data } = useQuery(QUERY_CATEGORIES);

    useEffect(() => {
      if(data) {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: data.categories
        });
      
        data.categories.forEach((product) => {
          idbPromise('categories', 'put', product);
        });
        // add else if to check if `loading` is undefined in `useQuery()` Hook
      } else if (!loading) {
        // since we're offline, get all of the data from the `categories` store
        idbPromise('categories', 'get').then((categories) => {
          // use retrieved data to set global state for offline browsing
          dispatch({
            type: UPDATE_CATEGORIES,
            categories: categories
          });
        });
      }
    }, [data, loading, dispatch]);
  
    const [addProduct, { error }] = useMutation(ADD_PRODUCT, {
      update(cache, { data: { addProduct } }) {
        try {
          // could potentially not exist yet, so wrap in a try...catch
          const { products } = cache.readQuery({ query: QUERY_PRODUCTS });
          cache.writeQuery({
            query: QUERY_PRODUCTS,
            data: { products: [addProduct, ...products] }
          });
        } catch (e) {
          console.log(e);
        }
    
        // update me object's cache, appending new Product to the end of the array
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, products: [...me.products, addProduct] } }
        });
      }
    });
  
    //const handleChange = event => {
    //  if (event.target.value.length <= 280) {
    //    setFormState(event.target.value);
    //    setCharacterCount(event.target.value.length);
    //  }
    //};

    
    const handleChange = event => {
      const { name, value } = event.target;
      setFormState({
        ...formState,
        [name]: value
      });
  };
  
    const handleFormSubmit = async event => {
      event.preventDefault();
      
      try {
        // add Product to database
        await addProduct({
          variables: { 
              description: formState.description,
              name: formState.name,
              price: formState.price,
              category: formState.category
          }
        });
    
        // clear form value
        setFormState('');
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    };
  
    return (
      <div >
        <form
          className="container-fluid d-flex flex-column col-5 ml-3 my-3"
          onSubmit={handleFormSubmit}
        >
        <h3 className=" my-2">Create A New Listing!</h3>
        <label>Product Name: </label>
        <input className="py-1 my-2" placeholder="name" name="name" onChange={handleChange} />
        <label>Price: </label>
        <input className="py-1 my-2" name="price" placeholder="00.00" onChange={handleChange} />
        <label>Category: </label>
        <select className="py-2 my-2" name="category" value={formState.category} onChange={handleChange} >
          <option>Select Category</option>
            {categories.map(item => (
              <option
                value={item._id}
                key={item._id}
              >
                {item.name}
              </option>
            ))}
            
        </select>
        <label className=" my-2">Description: </label>
        <textarea
          placeholder="Here's a new product..."
          name='description'
          className="form-input"
          onChange={handleChange}
        ></textarea>
        <p>
          {error && <span>Something went wrong...</span>}
        </p>
          <button className="btn m-1" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  };
  
  export default ProductForm;