import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import w from '../utils/asyncHandler.js';
export const toggleFavorite = w(async (q, s) => {
  const u = await User.findById(q.user.id), id = q.params.id;
  const has = u.favorites.some(x => x.equals(id));
  u.favorites = has ? u.favorites.filter(x => !x.equals(id)) : [...u.favorites, id];
  await u.save(); s.json({ saved: !has });
});
export const library = w(async (q, s) => {
  const u = await User.findById(q.user.id).populate('favorites');
  const mine = await Recipe.find({ author: q.user.id }).sort({ createdAt: -1 });
  const rated = mine.filter(x => x.numReviews);
  s.json({
    favorites: u.favorites, mine,
    stats: { recipes: mine.length, favorites: u.favorites.length,
      avgRating: rated.length ? +(rated.reduce((a, x) => a + x.rating, 0) / rated.length).toFixed(1) : 0 }
  });
});
