import React, { useEffect } from 'react';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";
import { idbPromise } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

function CategoryMenu() {
  const dispatch = useDispatch();

  const state = useSelector(state => state);

  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div className='col-md-3 borderr'>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <h2 className="mt-2 col-12 text-center">Browse by Category:</h2>
          {categories.map(item => (
            <div className="col-md-12 col-sm-3 col-6">
              <button
                className='my-2 btn p-3 text-monospace btn-text w-100'
                key={item._id}
                onClick={() => {
                  handleClick(item._id);
                }}
              >
                {item.name}
              </button>
            </div>
          ))}
          <div className="col-md-12 col-sm-3 col-6">
            <button
                className='my-2 btn p-3 text-monospace btn-text w-100'
                onClick={() => {
                  handleClick("");
                }}
              >
                All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryMenu;
