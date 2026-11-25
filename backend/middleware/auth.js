import jwt from 'jsonwebtoken';
export const auth = (q, s, n) => {
  const t = (q.headers.authorization || '').replace('Bearer ', '');
  try { q.user = jwt.verify(t, process.env.JWT_SECRET); n(); }
  catch { s.status(401).json({ message: 'Please login again' }); }
};
export const admin = (q, s, n) => q.user.role === 'admin' ? n() : s.status(403).json({ message: 'Admin only' });
