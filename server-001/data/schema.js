import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Product {
        id: ID
        name: String
        price: Float
        description: String
        soldOut: Boolean
        stores: [Store]
    }

    enum SoldOutStatus {
        AVAILABLE
        DISCONTINUED
        LIMITED
        ON_SALE
        SOLD_OUT
    }

    type Store {
        id: ID
        name: String
        address: String
    }

    type Query {
        getProduct(id: ID): Product
    }

    input StoreInput {
        id: ID
        name: String
        address: String
        }

    input ProductInput {
        id: ID
        name: String
        price: Float
        description: String
        soldOut: Boolean
        stores: [StoreInput]!
    }

    type Mutation {
        createProduct(input: ProductInput): Product
    }
`);

export default schema;
