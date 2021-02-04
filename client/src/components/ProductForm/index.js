import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { ADD_PRODUCT } from '../../utils/mutations';
import { QUERY_PRODUCTS, QUERY_ME } from '../../utils/queries';
import { useSelector } from 'react-redux';

const ProductForm = () => {
    const [formState, setFormState] = useState({ name: '', price: '', category: '', description: '' });
    const [characterCount, setCharacterCount] = useState(0);

    const state = useSelector(state => state);

    const { categories } = state;
  
    const [addThought, { error }] = useMutation(ADD_PRODUCT, {
      update(cache, { data: { addProduct } }) {
        try {
          // could potentially not exist yet, so wrap in a try...catch
          const { products } = cache.readQuery({ query: QUERY_PRODUCTS });
          cache.writeQuery({
            query: QUERY_PRODUCTS,
            data: { products: [addProduct, ...products] }
          });
        } catch (e) {
          console.error(e);
        }
    
        // update me object's cache, appending new thought to the end of the array
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
  
    const handleFormSubmit = async event => {
      event.preventDefault();
    
      try {
        // add thought to database
        await addThought({
          variables: { 
              description: formState.description,
              name: formState.name,
              price: formState.price,
              category: formState.category._id
          }
        });
    
        // clear form value
        setFormState('');
        setCharacterCount(0);
      } catch (e) {
        console.error(e);
      }
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value
        });
    };
  
    return (
      <div>
        <form
          className="flex-row justify-center justify-space-between-md align-stretch"
          onSubmit={handleFormSubmit}
        >
        <label>Product Name:</label>
        <input placeholder="name" name="name" onChange={handleChange} />
        <label>Price:</label>
        <input name="price" placeholder="00.00" onChange={handleChange} />
        <label>Category:</label>
        <select name="category" >
            {categories.map(item => (
            <option
            value={item._id}
               key={item._id}
              
              >{item.name}
              </option>
            ))}
        </select>
        <textarea
          placeholder="Here's a new product..."
          name='description'
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
          Character Count: {characterCount}/280
          {error && <span className="ml-2">Something went wrong...</span>}
        </p>
          <button className="btn col-12 col-md-3" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  };
  
  export default ProductForm;