import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import w from '../utils/asyncHandler.js';
const sign = u => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const pub = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export const register = w(async (q, s) => {
  const { name, email, password } = q.body;
  if (!name || !email || !(password?.length >= 6)) return s.status(400).json({ message: 'Name, email and 6+ character password required' });
  if (await User.findOne({ email })) return s.status(400).json({ message: 'Email already registered' });
  const u = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  s.json({ token: sign(u), user: pub(u) });
});
export const login = w(async (q, s) => {
  const u = await User.findOne({ email: q.body.email });
  if (!u || !(await bcrypt.compare(q.body.password || '', u.password))) return s.status(400).json({ message: 'Invalid email or password' });
  s.json({ token: sign(u), user: pub(u) });
});
export const me = w(async (q, s) => s.json(pub(await User.findById(q.user.id))));
