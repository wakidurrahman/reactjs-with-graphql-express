import crypto from 'crypto';

class Product {
  constructor(id, { name, description, price, soldOut, stores }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.soldOut = soldOut;
    this.stores = stores;
  }
}

const productDatabase = {};

const resolvers = {
  getProduct: ({ id }) => {
    return new Product(id, productDatabase[id]);
  },
  createProduct: ({ input }) => {
    let id = crypto.randomBytes(10).toString('hex');
    productDatabase[id] = input;
    return new Product(id, input);
  },
};

export default resolvers;
