import gql from 'graphql-tag';

export const QUERY_CATEGORIES = gql`
{
  categories {
    _id
    name
  }
}
`;

export const QUERY_ME = gql`
{
  me {
    username
    first
    last
    following {
        username
    }
    products {
        _id
        name
        description
        price
        image
        createdAt
    }
    sold {
        name
        description
        price
        image
    }
    orders {
      _id
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        image
      }
    }
  }
}
`;

export const QUERY_USER = gql`
query user($username: String!){
  user(username: $username) {
    username
    first
    last
    following {
        username
    }
    products {
        _id
        name
        description
        price
        image
        createdAt
    }
    sold {
        name
        description
        price
        image
    }
    orders {
      _id
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        image
      }
    }
  }
}
`;

export const QUERY_CHECKOUT = gql`
  query checkout($products: [ID]!) {
    checkout(products: $products) {
      session
    }
  }
`;

export const QUERY_ALL_PRODUCTS = gql`
  {
    allProducts {
      _id
      name
      description
      image
      createdAt
      price
      quantity
      seller {
        _id
        username
      }
      category {
        name
      }
    }
  }
`;

export const QUERY_PRODUCTS = gql`
  query products($category: ID) {
    products(category: $category) {
      _id
      name
      description
      price
      createdAt
      quantity
      image
      sold
      seller {
        _id
        username
      }
      category {
        _id
      }
    }
  }
`;