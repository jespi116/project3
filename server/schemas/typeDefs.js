const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        email: String
        username: String
        first: String
        last: String
        following: [User]
        orders: [Order]
        products: [Product]
        sold: [Product]
        messages: [Message]
    }

    type Order {
        _id: ID
        purchaseDate: String
        products: [Product]
    }

    type Checkout {
        session: ID
    }

    type Message {
        _id: ID
        sender: User
        recipient: User
        sentAt: String
        text: String
    }

    type Product {
        _id: ID
        name: String
        description: String
        price: String
        image: String
        quantity: Int
        createdAt: String
        category: Category
        seller: User
        sold: Boolean
    }

    type Category {
        _id: ID
        name: String
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        users: [User]
        user(username: String!): User
        me: User
        categories: [Category]
        allProducts: [Product]
        products(category: ID, name: String): [Product]
        product(_id: ID!): Product
        order(_id: ID!): Order
        checkout(products: [ID]!): Checkout
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addProduct(name: String!, description: String, price: String!, image: String, quantity: Int, category: ID): Product
        removeProduct(_id: ID!): Product
        addFollow(followId: ID!): User
        removeFollow(followId: ID!): User
        sold(_id: ID!): Product
        addOrder(products: [ID]!): Order
    }
`;

module.exports = typeDefs;