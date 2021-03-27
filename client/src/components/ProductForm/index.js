import React, { useState, useEffect, Fragment } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { ADD_PRODUCT } from '../../utils/mutations';
import { QUERY_PRODUCTS, QUERY_ME, QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES } from '../../utils/actions';
import { useSelector, useDispatch } from 'react-redux';
import { idbPromise } from "../../utils/helpers";
import axios from 'axios';

const ProductForm = () => {
    const [file, setFile] = useState('');
    
    const [formState, setFormState] = useState({ name: '', price: '', image: 'Choose Image', category: '', description: '' });

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
      
    const handleChange = event => {
      const { name, value } = event.target;
      setFormState({
        ...formState,
        [name]: value
      });
    };

    const handleFile = event => {
      setFile(event.target.files[0]);
      setFormState({
        ...formState,
        image: event.target.files[0].name
      });
    }
  
    const handleFormSubmit = async event => {
      event.preventDefault();

      if(formState.image === 'Choose Image') {
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
          setFormState({ name: '', price: '', image: 'Choose Image', category: '', description: '' });
          window.location.reload();
        } catch (e) {
          console.log(e);
        }
        return;

      } else {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const res = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          await addProduct({
            variables: { 
                description: formState.description,
                name: formState.name,
                image: formState.image,
                price: formState.price,
                category: formState.category
            }
          });
          
          setFormState({ name: '', price: '', image: 'Choose Image', category: '', description: '' });
          
        } catch(err) {
          if(err.response.status === 500) {
            console.log('There was a problem with the server');
          } else {
            console.log(err.response.data.msg);
          }
        }
      }
    };
  
    return (
      <Fragment>
        <form
          className="container-fluid"
          onSubmit={handleFormSubmit}
        >
          <h3 className="row">Create A New Listing!</h3>
          <div className="mx-3">
            
            <label className="row">Product Name: </label>
            <input className="row py-1 my-2 w-100" placeholder="Name" name="name" onChange={handleChange} />
            <label className="row">Product Image: </label>
            <div className="custom-file py-1 my-4 row w-100">
              <input className="custom-file-input" placeholder="Product Image" name="image" type="file" onChange={handleFile} />
              <label className="custom-file-label">
                {formState.image}
              </label>
            </div>
            <label className="row">Price: </label>
            <input className="py-1 my-2 row w-100" name="price" placeholder="00.00" onChange={handleChange} />
            <label className="row">Category: </label>
            <select className="py-2 my-2 row w-100" name="category" value={formState.category} onChange={handleChange} >
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
            <label className="row my-2">Description: </label>
            <textarea
              placeholder="Here's a new product..."
              name='description'
              className="form-input row w-100"
              onChange={handleChange}
            ></textarea>
            <p className="row"> 
              {error && <span>Something went wrong...</span>}
            </p>
              <button className="row btn my-1 w-100" type="submit">
                Submit
              </button>
            </div>
        </form>
      </Fragment>
    );
  };
  
  export default ProductForm;