import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './data/schema.js';
import resolvers from './data/resolvers.js';

const PORT = 4000;

const app = express();

app.get('/', (req, res) => {
  res.send('GraphQL is ready to be used');
});

// Root resolver
const RootResolver = {
  product: () => {
    return {
      id: '1',
      name: 'A product',
      price: 100,
      description: 'A product description',
      soldOut: false,
      stores: [
        {
          id: '1',
          name: 'Store 1',
          address: '123 Main St',
        },
        {
          id: '2',
          name: 'Store 2',
          address: '456 Main St',
        },
        {
          id: '3',
          name: 'Store 3',
          address: '789 Main St',
        },
      ],
    };
  },
};
// GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: resolvers,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
