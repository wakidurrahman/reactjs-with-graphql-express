# React + GraphQL + Express (MongoDB)

This repository contains a minimal GraphQL server built with `Express` and `MongoDB` (Mongoose). It demonstrates GraphQL essentials: `schema design`, `resolvers`, `queries`, `mutations`, `aliases`, and `fragments`.

The working server lives in `server-001/`.

### Tech stack

- Express + express-graphql
- GraphQL (buildSchema API)
- MongoDB Atlas (via Mongoose)

### Directory structure

```
reactjs-with-graphql-express/
  server-001/
    data/
      schema.js          # GraphQL type definitions
      resolvers.js       # Resolver functions backed by MongoDB
      db-connectors.js   # Mongoose connection + model
    server.js            # Express + GraphQL endpoint

```

## Getting started

Prerequisites:

- Node.js 22.12.0+
- A MongoDB Atlas cluster (or local MongoDB)

1. Install dependencies

```bash

npm install
```

2. Configure MongoDB

- Update `server-001/data/db-connectors.js` to use your own connection string.
- Strongly recommended: move credentials into an environment variable (e.g., `MONGO_URI`) and load via `dotenv`.

3. Run the server

```bash
npm start
```

The GraphiQL IDE will be available at `http://localhost:4000/graphql`.

## GraphQL schema (high level)

Defined in `server-001/data/schema.js`:

- `Product` with fields: `id`, `name`, `description`, `price`, `soldOut` (enum), `inventory`, `stores`.
- `Store` with `id`, `name`, `address`.
- `SoldOutStatus` enum: `AVAILABLE | DISCONTINUED | LIMITED | ON_SALE | SOLD_OUT`.
- Queries: `getAllProducts`, `getProduct(id)`.
- Mutations: `createProduct(input)`, `updateProduct(input)`, `deleteProduct(id)`.

## Resolvers (MongoDB-backed)

Defined in `server-001/data/resolvers.js` using the `Widgets` Mongoose model:

- `getAllProducts`: returns all products
- `getProduct(id)`: returns a single product
- `createProduct(input)`: inserts a new product document
- `updateProduct(input)`: updates fields by `id`
- `deleteProduct(id)`: deletes a product by `id`

Note: The GraphQL schema returns a `Product` for `deleteProduct` but the resolver currently returns a string message. See the "Known limitations" section.

## Sample operations

### Query: all products

```graphql
query AllProducts {
  getAllProducts {
    id
    name
    price
    soldOut
    inventory
    stores {
      name
      address
    }
  }
}
```

### Query: single product (with alias + fragment)

```graphql
query OneProductWithAlias($id: ID) {
  widget: getProduct(id: $id) {
    ...ProductCore
    stores {
      name
    }
  }
}

fragment ProductCore on Product {
  id
  name
  description
  price
  soldOut
}
```

### Mutation: create product

```graphql
mutation {
  createProduct(
    input: {
      name: "Widget 01"
      description: "Another Widget"
      price: 300
      soldOut: AVAILABLE
      inventory: 25
      stores: [{ name: "Store 1", address: "123 Main St" }]
    }
  ) {
    id
    name
    price
    soldOut
  }
}
```

## Known limitations / TODO

- `deleteProduct` resolver returns a string but the schema declares `Product`. Consider returning the deleted product or changing the schema to return a `DeleteResponse` type.
- `db-connectors.js` contains a hard-coded MongoDB URI. Move to an environment variable and keep secrets out of the repo.
- `RootResolver` in `server-001/server.js` is unused and can be removed.

## Next steps

- Introduce environment-based config with `dotenv` and `.env`.
- Add input validation and error formatting.
- Implement pagination for `getAllProducts`.
- Add DataLoader for batching if you introduce relational lookups.
- Add authentication/authorization and field-level access control.
- Add tests and CI.

For a deeper walkthrough of the concepts learned and suggested practice, see `docs/GraphQL-Essential-Training.md`.
