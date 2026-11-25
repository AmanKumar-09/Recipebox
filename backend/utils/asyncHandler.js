export default f => (q, s) => f(q, s).catch(e => s.status(500).json({ message: e.message }));
