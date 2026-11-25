import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './auth.jsx';
import { Home, Explore, RecipeDetail, RecipeForm, Dashboard, Auth } from './pages.jsx';

function Nav() {
  const { user, logout } = useAuth(); const nav = useNavigate();
  const cls = ({ isActive }) => `px-3 py-1 rounded-full transition ${isActive ? 'bg-leaf text-cream' : 'hover:bg-sand'}`;
  return (
    <motion.header initial={{ y: -60 }} animate={{ y: 0 }} className="sticky top-0 z-50 backdrop-blur bg-cream/80 border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-bold">🍳 RecipeBox</Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <NavLink to="/" end className={cls}>Home</NavLink>
          <NavLink to="/recipes" className={cls}>Explore</NavLink>
          {user && <NavLink to="/add" className={cls}>+ Share</NavLink>}
          {user && <NavLink to="/dashboard" className={cls}>Dashboard</NavLink>}
          {user ? <button onClick={() => { logout(); nav('/'); }} className="ml-2 px-4 py-1.5 rounded-full bg-tomato text-white hover:opacity-90">Logout ({user.name.split(' ')[0]})</button>
                : <Link to="/login" className="ml-2 px-4 py-1.5 rounded-full bg-leaf text-cream hover:bg-moss transition">Sign in</Link>}
        </nav>
      </div>
    </motion.header>
  );
}
const Guard = ({ children }) => { const { user } = useAuth(); return user ? children : <Navigate to="/login" />; };
function AnimatedRoutes() {
  const loc = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Explore />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth register />} />
        <Route path="/add" element={<Guard><RecipeForm /></Guard>} />
        <Route path="/edit/:id" element={<Guard><RecipeForm /></Guard>} />
        <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
      </Routes>
    </AnimatePresence>
  );
}
export default () => (
  <BrowserRouter><AuthProvider><Nav /><AnimatedRoutes />
    <footer className="text-center text-sm py-8 text-moss">© RecipeBox — made with MERN</footer>
  </AuthProvider></BrowserRouter>
);
