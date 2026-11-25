import Review from '../models/Review.js';
import Recipe from '../models/Recipe.js';
import w from '../utils/asyncHandler.js';
export const list = w(async (q, s) => s.json(await Review.find({ recipeId: q.params.id }).populate('userId', 'name').sort({ createdAt: -1 })));
export const create = w(async (q, s) => {
  const { rating, comment } = q.body;
  await Review.findOneAndUpdate({ userId: q.user.id, recipeId: q.params.id }, { rating, comment }, { upsert: true });
  const rs = await Review.find({ recipeId: q.params.id });
  const avg = rs.reduce((a, x) => a + x.rating, 0) / rs.length;
  await Recipe.findByIdAndUpdate(q.params.id, { rating: +avg.toFixed(1), numReviews: rs.length });
  s.json({ ok: true });
});
