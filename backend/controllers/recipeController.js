import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import w from '../utils/asyncHandler.js';
const canEdit = (q, r) => r && (q.user.role === 'admin' || String(r.author) === q.user.id);

export const home = w(async (q, s) => {
  const all = await Recipe.find().sort({ createdAt: -1 });
  const day = Math.floor(Date.now() / 864e5);
  s.json({ recipeOfDay: all[day % all.length], top: [...all].sort((a, b) => b.rating - a.rating).slice(0, 4), latest: all.slice(0, 4) });
});
export const list = w(async (q, s) => {
  const { q: term, category, sort } = q.query, f = {};
  if (category) f.category = category;
  if (term) { // search by recipe name OR ingredient
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    f.$or = [{ title: re }, { 'ingredients.name': re }];
  }
  const order = { rating: { rating: -1 }, quick: { cookTime: 1 }, az: { title: 1 } }[sort] || { createdAt: -1 };
  s.json(await Recipe.find(f).sort(order));
});
export const getOne = w(async (q, s) => s.json(await Recipe.findById(q.params.id)));
export const create = w(async (q, s) => {
  const u = await User.findById(q.user.id);
  const { title, description, image, category, cookTime, servings, ingredients, steps } = q.body;
  if (!title || !ingredients?.length || !steps?.length) return s.status(400).json({ message: 'Title, ingredients and steps are required' });
  s.json(await Recipe.create({ title, description, image, category, cookTime, servings, ingredients, steps, author: u._id, authorName: u.name }));
});
export const update = w(async (q, s) => {
  const r = await Recipe.findById(q.params.id);
  if (!canEdit(q, r)) return s.status(403).json({ message: 'You can only edit your own recipes' });
  const { title, description, image, category, cookTime, servings, ingredients, steps } = q.body;
  Object.assign(r, { title, description, image, category, cookTime, servings, ingredients, steps });
  s.json(await r.save());
});
export const remove = w(async (q, s) => {
  const r = await Recipe.findById(q.params.id);
  if (!canEdit(q, r)) return s.status(403).json({ message: 'You can only delete your own recipes' });
  await r.deleteOne(); s.json({ ok: true });
});
