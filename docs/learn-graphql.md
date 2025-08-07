# Learn GraphQL

## GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## GraphQL Schema

A GraphQL schema is a collection of type definitions that describe the data and operations that are available in the API.

### Basic GraphQL schema

The schema defines the query type and then also what it is expecting.

```graphql
type Query {
  hello: String
}
```

```javascript
const schema = buildSchema(`
  type Product {
    id: ID
    name: String
    description: String
    image: String;
    soldOut: Boolean
    price: Float
    discount: Float
    category: String
    isAvailable: Boolean
    createdAt: String
    updatedAt: String
    reviews: [Review]
  }


  type Query {
    products: [Product]
  }
`;
```

### GraphQL resolvers

Resolver will actually resolve the results from each API endpoint. So the type definition provides what type of data we expect and the resolvers gets the data for us.

```javascript
const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
};
```

### GraphQL Query
