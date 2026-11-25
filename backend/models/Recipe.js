import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export default model('Recipe', new Schema({
  title: String, description: String, image: String,
  category: { type: String, enum: ['Veg', 'Non-Veg', 'Dessert'] },
  cookTime: Number, servings: { type: Number, default: 2 },
  ingredients: [{ name: String, qty: Number, unit: String }],
  steps: [String],
  author: { type: Schema.Types.ObjectId, ref: 'User' }, authorName: String,
  rating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 }
}, { timestamps: true }));
