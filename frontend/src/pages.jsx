import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from './api.js';
import { useAuth } from './auth.jsx';
import { toast } from './toast.js';

const EMOJI = { Veg: '🥗', 'Non-Veg': '🍗', Dessert: '🍰' };
const GRAD = { Veg: 'from-green-200 to-lime-100', 'Non-Veg': 'from-orange-200 to-red-100', Dessert: 'from-pink-200 to-amber-100' };
const fmt = n => (n ? +n.toFixed(2) : '');
const inp = 'w-full px-4 py-2.5 rounded-xl border border-sand bg-white outline-none focus:ring-2 ring-tomato';
const Page = ({ children }) => (
  <motion.main initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto px-4 py-10">{children}</motion.main>
);
const H = ({ children }) => <h2 className="font-serif text-3xl font-bold mb-6">{children}</h2>;
const Stars = ({ r }) => <span className="text-tomato">{'★'.repeat(Math.round(r))}{'☆'.repeat(5 - Math.round(r))} <span className="text-moss text-sm">{r || 'New'}</span></span>;
const Badge = ({ c }) => <span className={`text-xs px-2 py-0.5 rounded-full ${c === 'Veg' ? 'bg-green-100 text-green-800' : c === 'Non-Veg' ? 'bg-red-100 text-red-800' : 'bg-pink-100 text-pink-800'}`}>{c === 'Veg' ? '🟢 ' : c === 'Non-Veg' ? '🔴 ' : '🍰 '}{c}</span>;
function Img({ r, cls }) { // photo, or a styled emoji cover if the image is missing or broken
  const [bad, setBad] = useState(!r.image);
  return bad ? <div className={`${cls} bg-gradient-to-br ${GRAD[r.category]} flex items-center justify-center text-6xl`}>{EMOJI[r.category]}</div>
    : <img src={r.image} alt={r.title} onError={() => setBad(true)} className={`${cls} object-cover`} />;
}
function Grid({ items }) {
  if (!items.length) return <p className="text-moss">No recipes found.</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((r, i) => (
        <motion.div key={r._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8 }}>
          <Link to={`/recipes/${r._id}`} className="block bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition border border-sand">
            <Img r={r} cls="w-full aspect-[4/3] rounded-xl" />
            <div className="mt-3 flex items-center justify-between"><Badge c={r.category} /><span className="text-xs text-moss">⏱ {r.cookTime} min</span></div>
            <h3 className="font-serif font-bold mt-1 leading-tight">{r.title}</h3>
            <p className="text-sm text-moss">by {r.authorName}</p><Stars r={r.rating} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function Home() {
  const [d, setD] = useState(null); const [q, setQ] = useState(''); const nav = useNavigate(); const { user } = useAuth();
  useEffect(() => { api.get('/recipes/home').then(r => setD(r.data)); }, []);
  return (
    <Page>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sand to-cream p-10 md:p-16 mb-14">
        {d && <div className="hidden md:block absolute right-10 top-10 w-72 h-80">{d.top.slice(0, 3).map((r, i) => <div key={r._id} className="fl absolute w-36 h-36 rounded-2xl overflow-hidden shadow-2xl" style={{ left: i * 50, top: i * 40, animationDelay: `${i * 0.7}s`, rotate: `${(i - 1) * 8}deg` }}><Img r={r} cls="w-full h-full" /></div>)}</div>}
        <motion.h1 initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="font-serif text-5xl md:text-6xl md:max-w-[34rem] font-extrabold leading-tight">Cook, Share &amp; <em className="text-tomato">Savor</em> Every Recipe.</motion.h1>
        <p className="mt-4 text-moss max-w-xl">Find recipes by name or by the ingredients in your kitchen, and share your own with everyone.</p>
        <form onSubmit={e => { e.preventDefault(); nav(`/recipes?q=${q}`); }} className="mt-8 flex max-w-xl bg-white rounded-full p-1.5 shadow">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipe or ingredient (e.g. paneer)" className="flex-1 px-4 outline-none bg-transparent" />
          <button className="bg-tomato text-white px-6 rounded-full">Search</button>
        </form>
      </section>
      {d && <>
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-14 bg-leaf text-cream rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center">
          <Img r={d.recipeOfDay} cls="w-full md:w-72 aspect-[4/3] rounded-2xl shadow-2xl" />
          <div><p className="text-tomato text-sm font-bold tracking-widest">RECIPE OF THE DAY</p>
            <h3 className="font-serif text-3xl font-bold my-2">{d.recipeOfDay.title}</h3><p className="opacity-80">{d.recipeOfDay.description}</p>
            <p className="mt-2 text-sm opacity-80">⏱ {d.recipeOfDay.cookTime} min · 🍽 {d.recipeOfDay.servings} servings</p>
            <Link to={`/recipes/${d.recipeOfDay._id}`} className="inline-block mt-4 bg-tomato px-5 py-2 rounded-full">Cook this</Link></div>
        </motion.section>
        <H>Browse by Category</H>
        <div className="grid grid-cols-3 gap-4 mb-14">{['Veg', 'Non-Veg', 'Dessert'].map(c => <Link key={c} to={`/recipes?category=${c}`} className={`rounded-2xl p-6 text-center bg-gradient-to-br ${GRAD[c]} hover:scale-105 transition`}><div className="text-5xl">{EMOJI[c]}</div><p className="font-serif font-bold text-xl mt-2">{c}</p></Link>)}</div>
        <H>Top Rated</H><Grid items={d.top} />
        <div className="my-14"><H>Latest Recipes</H><Grid items={d.latest} /></div>
        <div className="text-center bg-sand rounded-3xl p-10"><h3 className="font-serif text-3xl font-bold">Got a recipe worth sharing?</h3><Link to={user ? '/add' : '/login'} className="inline-block mt-4 bg-leaf text-cream px-6 py-2.5 rounded-full hover:bg-moss transition">Share your recipe</Link></div>
      </>}
    </Page>
  );
}

export function Explore() {
  const [sp, setSp] = useSearchParams(); const [items, setItems] = useState([]);
  const q = sp.get('q') || '', category = sp.get('category') || '', sort = sp.get('sort') || '';
  useEffect(() => { api.get('/recipes', { params: { q, category, sort } }).then(r => setItems(r.data)); }, [q, category, sort]);
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n); };
  return (
    <Page>
      <H>Explore Recipes</H>
      <input value={q} onChange={e => set('q', e.target.value)} placeholder="Search by recipe or ingredient..." className="w-full md:w-96 px-5 py-3 rounded-full border border-sand bg-white outline-none focus:ring-2 ring-tomato mb-4" />
      <select value={sort} onChange={e => set('sort', e.target.value)} className="mb-4 md:ml-3 px-4 py-3 rounded-full border border-sand bg-white">
        <option value="">Newest</option><option value="rating">Top rated</option><option value="quick">Quickest</option><option value="az">A–Z</option></select>
      <div className="flex flex-wrap gap-2 mb-4">{['', 'Veg', 'Non-Veg', 'Dessert'].map(c => <button key={c} onClick={() => set('category', c)} className={`px-4 py-1.5 rounded-full text-sm transition ${category === c ? 'bg-leaf text-cream' : 'bg-white border border-sand hover:bg-sand'}`}>{c || 'All'}</button>)}</div>
      <p className="text-sm text-moss mb-6">{items.length} recipes found</p>
      <Grid items={items} />
    </Page>
  );
}

export function RecipeDetail() {
  const { id } = useParams(); const { user } = useAuth(); const nav = useNavigate();
  const [r, setR] = useState(null); const [rv, setRv] = useState([]); const [fav, setFav] = useState(false);
  const [serv, setServ] = useState(1); const [rating, setRating] = useState(5); const [comment, setComment] = useState('');
  useEffect(() => { api.get(`/recipes/${id}`).then(x => { setR(x.data); setServ(x.data.servings); }); }, [id]);
  const load = () => {
    api.get(`/recipes/${id}/reviews`).then(x => setRv(x.data));
    api.get(`/recipes/${id}`).then(x => setR(x.data));
    if (user) api.get('/me/library').then(x => setFav(x.data.favorites.some(f => f._id === id)));
  };
  useEffect(load, [id]);
  if (!r) return <Page>Loading...</Page>;
  const k = serv / r.servings, canEdit = user && (user.role === 'admin' || user.id === r.author);
  return (
    <Page>
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Img r={r} cls="w-full aspect-[4/3] rounded-3xl shadow-2xl" /></motion.div>
        <div>
          <Badge c={r.category} />
          <h1 className="font-serif text-4xl font-bold mt-3">{r.title}</h1>
          <p className="text-moss">by {r.authorName} · ⏱ {r.cookTime} min</p>
          <div className="my-3"><Stars r={r.rating} /> <span className="text-sm text-moss">({r.numReviews} reviews)</span></div>
          <p className="leading-relaxed">{r.description}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => user ? api.post(`/me/favorites/${id}`).then(x => { toast(x.data.saved ? 'Added to favorites ♥' : 'Removed from favorites'); load(); }) : nav('/login')} className={`px-6 py-2.5 rounded-full transition ${fav ? 'bg-tomato text-white' : 'bg-leaf text-cream hover:bg-moss'}`}>{fav ? '♥ Favorited' : '♡ Add to Favorites'}</button>
            <button onClick={() => { navigator.clipboard?.writeText(location.href); toast('Link copied 🔗'); }} className="px-5 py-2.5 rounded-full border border-sand bg-white hover:bg-sand">🔗 Share</button>
            {canEdit && <><Link to={`/edit/${id}`} className="px-5 py-2.5 rounded-full border border-sand bg-white hover:bg-sand">✏️ Edit</Link>
              <button onClick={() => confirm('Delete this recipe?') && api.delete(`/recipes/${id}`).then(() => { toast('Recipe deleted'); nav('/recipes'); })} className="px-5 py-2.5 rounded-full border border-red-200 text-red-600 bg-white hover:bg-red-50">🗑 Delete</button></>}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-[2fr_3fr] gap-10 mt-12">
        <div className="bg-white border border-sand rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between mb-4"><h3 className="font-serif text-2xl font-bold">Ingredients</h3>
            <div className="flex items-center gap-3 bg-sand rounded-full px-2 py-1">
              <button onClick={() => setServ(Math.max(1, serv - 1))} className="w-8 h-8 rounded-full bg-white hover:bg-tomato hover:text-white transition">−</button>
              <span className="text-sm font-bold w-20 text-center">{serv} servings</span>
              <button onClick={() => setServ(serv + 1)} className="w-8 h-8 rounded-full bg-white hover:bg-tomato hover:text-white transition">+</button></div></div>
          <ul className="space-y-2">{r.ingredients.map((i, n) => <li key={n} className="flex gap-2 border-b border-sand pb-2"><b className="min-w-[4.5rem]">{fmt(i.qty * k)} {i.unit}</b><span>{i.name}</span></li>)}</ul>
        </div>
        <div><h3 className="font-serif text-2xl font-bold mb-4">Method</h3>
          {r.steps.map((s, n) => <motion.div key={n} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="flex gap-4 mb-4"><span className="w-9 h-9 shrink-0 rounded-full bg-tomato text-white flex items-center justify-center font-bold">{n + 1}</span><p className="pt-1">{s}</p></motion.div>)}</div>
      </div>
      <section className="mt-14 max-w-2xl"><H>Reviews</H>
        {user && <div className="bg-white p-5 rounded-2xl border border-sand mb-6">
          <select value={rating} onChange={e => setRating(+e.target.value)} className="mb-3 p-2 rounded border border-sand">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)}</option>)}</select>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="How did it turn out?" className="w-full p-3 rounded border border-sand outline-none" rows="3" />
          <button onClick={() => api.post(`/recipes/${id}/reviews`, { rating, comment }).then(() => { setComment(''); toast('Review posted'); load(); })} className="mt-2 bg-tomato text-white px-5 py-2 rounded-full">Post review</button></div>}
        {rv.map(x => <div key={x._id} className="py-4 border-b border-sand"><b>{x.userId?.name}</b> <Stars r={x.rating} /><p className="text-moss">{x.comment}</p></div>)}
        {!rv.length && <p className="text-moss">No reviews yet. Be the first!</p>}
      </section>
    </Page>
  );
}

export function RecipeForm() {
  const { id } = useParams(); const nav = useNavigate();
  const [f, setF] = useState({ title: '', description: '', image: '', category: 'Veg', cookTime: 30, servings: 2 });
  const [ing, setIng] = useState([{ name: '', qty: '', unit: '' }]); const [steps, setSteps] = useState(['']); const [err, setErr] = useState('');
  useEffect(() => { if (id) api.get(`/recipes/${id}`).then(({ data: d }) => { setF({ title: d.title, description: d.description, image: d.image, category: d.category, cookTime: d.cookTime, servings: d.servings }); setIng(d.ingredients); setSteps(d.steps); }); }, [id]);
  const set = (k, v) => setF({ ...f, [k]: v });
  const submit = async e => {
    e.preventDefault();
    const body = { ...f, cookTime: +f.cookTime, servings: +f.servings, ingredients: ing.filter(i => i.name).map(i => ({ ...i, qty: +i.qty || 0 })), steps: steps.filter(Boolean) };
    try { const { data } = await (id ? api.put(`/recipes/${id}`, body) : api.post('/recipes', body)); toast(id ? 'Recipe updated' : 'Recipe published 🎉'); nav(`/recipes/${data._id}`); }
    catch (x) { setErr(x.response?.data?.message || 'Something went wrong'); }
  };
  return (
    <Page>
      <form onSubmit={submit} className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-sand space-y-3">
        <h1 className="font-serif text-3xl font-bold mb-2">{id ? 'Edit recipe' : 'Share a recipe'}</h1>
        <input required className={inp} placeholder="Recipe title" value={f.title} onChange={e => set('title', e.target.value)} />
        <textarea className={inp} rows="2" placeholder="Short description" value={f.description} onChange={e => set('description', e.target.value)} />
        <input className={inp} placeholder="Photo link (https://...)" value={f.image} onChange={e => set('image', e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <select className={inp} value={f.category} onChange={e => set('category', e.target.value)}><option>Veg</option><option>Non-Veg</option><option>Dessert</option></select>
          <input type="number" min="1" className={inp} placeholder="Minutes" value={f.cookTime} onChange={e => set('cookTime', e.target.value)} />
          <input type="number" min="1" className={inp} placeholder="Servings" value={f.servings} onChange={e => set('servings', e.target.value)} /></div>
        <p className="font-bold pt-2">Ingredients</p>
        {ing.map((i, n) => <div key={n} className="grid grid-cols-[1fr_5rem_5rem_2rem] gap-2">
          <input className={inp} placeholder="Name" value={i.name} onChange={e => setIng(ing.map((x, m) => m === n ? { ...x, name: e.target.value } : x))} />
          <input className={inp} type="number" step="any" placeholder="Qty" value={i.qty} onChange={e => setIng(ing.map((x, m) => m === n ? { ...x, qty: e.target.value } : x))} />
          <input className={inp} placeholder="Unit" value={i.unit} onChange={e => setIng(ing.map((x, m) => m === n ? { ...x, unit: e.target.value } : x))} />
          <button type="button" onClick={() => setIng(ing.length > 1 ? ing.filter((_, m) => m !== n) : ing)} className="text-red-500">✕</button></div>)}
        <button type="button" onClick={() => setIng([...ing, { name: '', qty: '', unit: '' }])} className="text-sm text-tomato font-bold">+ Add ingredient</button>
        <p className="font-bold pt-2">Steps</p>
        {steps.map((s, n) => <div key={n} className="flex gap-2"><textarea className={inp} rows="2" placeholder={`Step ${n + 1}`} value={s} onChange={e => setSteps(steps.map((x, m) => m === n ? e.target.value : x))} />
          <button type="button" onClick={() => setSteps(steps.length > 1 ? steps.filter((_, m) => m !== n) : steps)} className="text-red-500">✕</button></div>)}
        <button type="button" onClick={() => setSteps([...steps, ''])} className="text-sm text-tomato font-bold">+ Add step</button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-leaf text-cream py-3 rounded-xl hover:bg-moss transition">{id ? 'Save changes' : 'Publish recipe'}</button>
      </form>
    </Page>
  );
}

export function Dashboard() {
  const { user } = useAuth(); const [lib, setLib] = useState(null);
  useEffect(() => { api.get('/me/library').then(r => setLib(r.data)); }, []);
  if (!lib) return <Page>Loading...</Page>;
  return (
    <Page>
      <H>Hello, {user.name} 👋</H>
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[['My recipes', lib.stats.recipes], ['Favorites', lib.stats.favorites], ['Avg rating on my recipes', lib.stats.avgRating || '—']].map(([k, v]) =>
          <motion.div key={k} whileHover={{ scale: 1.03 }} className="bg-leaf text-cream rounded-2xl p-5"><p className="text-sm opacity-70">{k}</p><p className="font-serif text-3xl font-bold">{v}</p></motion.div>)}
      </div>
      <h3 className="font-serif text-2xl mb-4">My Recipes</h3><Grid items={lib.mine} />
      <div className="mt-12"><h3 className="font-serif text-2xl mb-4">My Favorites</h3><Grid items={lib.favorites} /></div>
    </Page>
  );
}

export function Auth({ register }) {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault();
    try { const r = await api.post(register ? '/auth/register' : '/auth/login', f); login(r.data); nav('/dashboard'); }
    catch (x) { setErr(x.response?.data?.message || 'Something went wrong'); }
  };
  const field = (k, ph, type = 'text') => <input name={k} autoComplete={type === 'password' ? 'new-password' : 'off'} type={type} required placeholder={ph} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} className={`${inp} mb-3`} />;
  return (
    <Page>
      <form onSubmit={submit} autoComplete="off" className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-sand">
        <h1 className="font-serif text-3xl font-bold mb-6">{register ? 'Create account' : 'Welcome back'}</h1>
        {register && field('name', 'Full name')}{field('email', 'Email', 'email')}{field('password', 'Password (6+ chars)', 'password')}
        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}
        <button className="w-full bg-leaf text-cream py-3 rounded-xl hover:bg-moss transition">{register ? 'Register' : 'Login'}</button>
        <p className="text-sm text-center mt-4 text-moss">{register ? <Link to="/login">Have an account? Login</Link> : <Link to="/register">New here? Register</Link>}</p>
      </form>
    </Page>
  );
}
