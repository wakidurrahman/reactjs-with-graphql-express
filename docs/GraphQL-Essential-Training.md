# GraphQL Essential Training – Notes and Next Steps

This document summarizes what you practiced and learned in the GraphQL Essential Training portion of this repository, and proposes concrete next steps.

## What you built

- A GraphQL API using Express and `express-graphql`
- A MongoDB-backed data layer via Mongoose
- A `Product` domain model including `Store` sub-objects and a `SoldOutStatus` enum
- End-to-end flow: GraphQL Schema → Resolvers → MongoDB CRUD

### Server overview

- Endpoint: `http://localhost:4000/graphql` (GraphiQL enabled)
- Files:
  - `server-001/server.js`: Express app + GraphQL middleware
  - `server-001/data/schema.js`: Type system using `buildSchema`
  - `server-001/data/resolvers.js`: Resolver functions (CRUD)
  - `server-001/data/db-connectors.js`: Mongoose connection + `Widgets` model

## Core GraphQL concepts covered

### Schema-first design

- Types (`Product`, `Store`) and an enum (`SoldOutStatus`)
- Entry points: `Query` and `Mutation`

### Resolvers

- Mapped field-level and operation-level resolution to MongoDB via Mongoose
- Patterns used: `find`, `findById`, `save`, `findOneAndUpdate`, `deleteOne`

### Queries

- Fetch lists and single items (`getAllProducts`, `getProduct`)
- Variables in GraphiQL / client queries

### Mutations

- Create, update, delete flows with typed input (`ProductInput` and `StoreInput`)

### Aliases and Fragments

- Aliases let clients rename fields in the response for their needs:
  ```graphql
  query ($id: ID) {
    widget: getProduct(id: $id) {
      id
      name
    }
  }
  ```
- Fragments promote reuse across queries:
  ```graphql
  fragment ProductCore on Product {
    id
    name
    price
    soldOut
  }
  ```

## Example operations

### Query all products

```graphql
query {
  getAllProducts {
    id
    name
    price
    soldOut
    inventory
  }
}
```

### Query one product with alias + fragment

```graphql
query OneProduct($id: ID) {
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

### Create a product

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

## Current gaps to address

- The schema says `deleteProduct(id: ID!): Product` but the resolver returns a string message. Choose one:

  1. Change schema to return a `DeleteResponse` type with `ok`/`message`, or
  2. Return the deleted `Product` from the resolver (fetch before delete and return it).

- `db-connectors.js` includes a hard-coded MongoDB URI. Move to env vars (`MONGO_URI`) and use `dotenv`.

## Suggested next steps

1. Production hygiene

   - Add `dotenv`, read `MONGO_URI` from `.env`
   - Centralize error handling and format GraphQL errors
   - Add logging (morgan/pino) and request ids

2. API hardening

   - Input validation (Joi/Zod) on mutation inputs
   - Pagination on `getAllProducts` (limit/offset or cursor-based)
   - Sorting and filtering support

3. Performance

   - Index common MongoDB fields
   - Add DataLoader if you add relational/nested fetches

4. Security

   - AuthN/AuthZ (JWT or session)
   - Field- and type-level authorization rules

5. DX & Quality

   - Add tests (Jest) for resolvers and schema
   - Linting/formatting (ESLint/Prettier)
   - CI workflow (GitHub Actions)

6. Client examples
   - Add an Apollo Client or Relay sample consuming this API
   - Demonstrate cache normalization, fragments, pagination on client

### Optional: adjust types

- Consider modeling `soldOut` as a boolean and creating a separate `status` enum for catalog status.
- Return consistent `id` across MongoDB by mapping `_id` to `id` via schema/resolvers or Mongoose virtuals.

## Troubleshooting

- "require is not defined": use ES module `import` syntax (this repo uses ESM)
- Mongo connection issues: confirm `MONGO_URI`, IP allowlist, and network access in Atlas
- GraphiQL not loading: ensure server is on port 4000 and no proxy blocks it
