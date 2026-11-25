import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export default model('Review', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe' },
  rating: Number, comment: String
}, { timestamps: true }));
