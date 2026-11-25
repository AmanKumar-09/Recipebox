import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export default model('User', new Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: 'user' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
}));
