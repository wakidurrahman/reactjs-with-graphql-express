import crypto from 'crypto';
import { Widgets } from './db-connectors.js';

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
  getProduct: async ({ id }) => {
    try {
      const product = await Widgets.findById(id);
      return product;
    } catch (error) {
      throw new Error(error);
    }
  },
  createProduct: async ({ input }) => {
    const savedProduct = new Widgets({
      name: input.name,
      description: input.description,
      price: input.price,
      soldOut: input.soldOut,
      inventory: input.inventory,
      stores: input.stores,
    });

    savedProduct.id = savedProduct._id; // Convert _id to id
    try {
      await savedProduct.save();
      return savedProduct;
    } catch (error) {
      throw new Error(error);
    }
  },
  updateProduct: async ({ input }) => {
    try {
      const updatedProduct = await Widgets.findOneAndUpdate(
        { _id: input.id },
        input,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteProduct: async ({ id }) => {
    try {
      const deletedProduct = await Widgets.deleteOne({ _id: id });
      return deletedProduct;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default resolvers;
