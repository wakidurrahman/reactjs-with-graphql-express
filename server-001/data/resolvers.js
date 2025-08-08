import { Widgets } from './db-connectors.js';

const resolvers = {
  // Get all products
  getAllProducts: async () => {
    try {
      const products = await Widgets.find();
      return products;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Get a single product
  getProduct: async ({ id }) => {
    try {
      const product = await Widgets.findById(id);
      return product;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Create a new product
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

  // Update a product
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

  // Delete a product
  deleteProduct: async ({ id }) => {
    try {
      await Widgets.deleteOne({ _id: id });
      return 'Successfully deleted product';
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default resolvers;
