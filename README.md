# 🍳 RecipeBox
RecipeBox is a MERN stack recipe sharing platform. Users post recipes with ingredients, steps, cooking time and a photo, search by recipe or ingredient, filter by Veg / Non-Veg / Dessert, save favorites and rate recipes.

## Features
- Register, login, logout (JWT + bcrypt), protected routes
- Home: Recipe of the Day, categories, top rated, latest
- Explore: search by recipe name or ingredient, category filter, sort (newest, top rated, quickest, A-Z)
- Recipe page: servings +/- buttons automatically scale every ingredient quantity
- Share, edit and delete your own recipes (admin can edit/delete any)
- Favorites, ratings and reviews, personal dashboard

## Tech stack
React (Vite) + Tailwind CSS + Framer Motion, Node.js + Express (MVC), MongoDB + Mongoose, JWT, bcryptjs

## Structure
backend: controllers, routes, models, middleware, utils, server.js, seed.js, .env
frontend: src/App.jsx, pages.jsx, auth.jsx, api.js, toast.js

## Run
1. cd backend && npm i && npm run seed && npm run dev   (API :5000, seeds 10 recipes + admin)
2. cd frontend && npm i && npm run dev   (App :5173)
Admin login: admin@recipebox.com / admin123 (set in backend/.env)
Env: backend/.env (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD), frontend/.env (VITE_API_URL)

## API
POST /api/auth/register, /login; GET /api/auth/me
GET /api/recipes (?q= ?category= ?sort=), /home, /:id; POST/PUT/DELETE /api/recipes (login required)
GET/POST /api/recipes/:id/reviews
POST /api/me/favorites/:id; GET /api/me/library
