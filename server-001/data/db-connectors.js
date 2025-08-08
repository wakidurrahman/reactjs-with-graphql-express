import mongoose from 'mongoose';

const MONGO_URI =
  'mongodb+srv://wakidur:graphql20250808@reactjs-with-qraphql.ax8jc2o.mongodb.net/?retryWrites=true&w=majority&appName=reactjs-with-qraphql';

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectMongo();

const widgetSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  soldOut: String,
  inventory: Number,
  stores: Array,
});

const Widgets = mongoose.model('widgets', widgetSchema);

export { Widgets };
