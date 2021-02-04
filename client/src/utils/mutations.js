import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;


export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!) {
    addOrder(products: $products) {
      purchaseDate
      products {
        _id
      name
      description
      price
      quantity
      category {
        name
      } 
      }
    }
  }
`;


export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation addProduct($name: String!, $description: String, $price: String!, $image: String, $category: ID) {
    addProduct(name: $name, description: $description, image: $image, price: $price, category: $category) {
      _id
      name
      price
      createdAt
      category {
        _id
      }
      seller {
        _id
      }
    }
  }
`;

export const REMOVE_PRODUCT = gql`
  mutation removeProduct($_id: ID!) {
    removeProduct(_id: $_id) {
      name
    }
  }
`;

export const SOLD = gql`
  mutation sold($_id: ID!) {
    sold(_id: $_id) {
      _id
      name
    }
  }
`;