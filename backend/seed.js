import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Recipe from './models/Recipe.js';
const u = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
// [title, category, minutes, servings, image, description, "name:qty:unit|...", "step|step|...", rating]
const data = [
 ['Creamy Tomato Pasta','Veg',25,2,u('1473093295043-cdd812d0e601'),'A silky tomato and garlic pasta that is ready in under 30 minutes.','Pasta:200:g|Tomatoes:4:|Garlic:3:cloves|Cream:50:ml|Olive oil:2:tbsp|Basil leaves:6:|Salt:1:tsp','Boil the pasta in salted water until al dente.|Saute garlic in olive oil, add chopped tomatoes and cook 10 minutes.|Blend the sauce, stir in the cream and simmer for 3 minutes.|Toss the pasta in the sauce and finish with basil.',4.6],
 ['Homemade Cheese Pizza','Veg',40,4,u('1565299624946-b28f40a0ae38'),'Crisp crust, tangy sauce and plenty of melted cheese.','Pizza dough:500:g|Pizza sauce:150:ml|Mozzarella:200:g|Olive oil:1:tbsp|Oregano:1:tsp','Preheat the oven to 230 C.|Roll out the dough and brush with olive oil.|Spread the sauce and cover with mozzarella.|Bake for 12 to 15 minutes until golden, then sprinkle oregano.',4.7],
 ['Herb Grilled Chicken Plate','Non-Veg',35,2,u('1504674900247-0877df9cc836'),'Juicy herb-marinated chicken served with grilled vegetables.','Chicken breast:400:g|Olive oil:2:tbsp|Lemon juice:2:tbsp|Garlic:3:cloves|Mixed herbs:1:tsp|Bell peppers:2:|Salt:1:tsp','Marinate the chicken with oil, lemon, garlic, herbs and salt for 20 minutes.|Grill the chicken 6 minutes per side until cooked through.|Grill the sliced peppers alongside.|Rest the chicken for 5 minutes and serve.',4.5],
 ['Chicken Kebab Skewers','Non-Veg',30,4,u('1555939594-58d7cb561ad1'),'Smoky, spiced chicken skewers perfect for parties.','Chicken:500:g|Yogurt:100:g|Ginger garlic paste:2:tbsp|Red chilli powder:1:tsp|Garam masala:1:tsp|Lemon juice:1:tbsp|Salt:1:tsp','Mix the chicken with yogurt, spices and lemon juice.|Marinate for at least 30 minutes.|Thread onto skewers.|Grill or bake at 220 C for 15 minutes, turning once.',4.4],
 ['Fluffy Berry Pancakes','Dessert',20,3,u('1567620905732-2d1ec7ab7445'),'Soft golden pancakes topped with fresh berries and syrup.','Flour:200:g|Milk:250:ml|Egg:1:|Sugar:2:tbsp|Baking powder:2:tsp|Butter:2:tbsp|Mixed berries:100:g','Whisk the flour, sugar and baking powder.|Add milk, egg and melted butter and mix into a smooth batter.|Cook ladlefuls on a buttered pan until bubbles appear, then flip.|Stack and top with berries and syrup.',4.8],
 ['French Toast with Berries','Dessert',15,2,u('1484723091739-30a097e8f929'),'Cinnamon French toast with a berry topping for a sweet breakfast.','Bread slices:4:|Egg:2:|Milk:80:ml|Cinnamon:0.5:tsp|Butter:1:tbsp|Strawberries:100:g|Honey:1:tbsp','Whisk the eggs, milk and cinnamon.|Dip each bread slice in the mixture.|Fry in butter until golden on both sides.|Serve with berries and honey.',4.3],
 ['Rainbow Buddha Bowl','Veg',25,2,u('1512621776951-a57141f2eefd'),'A colourful, healthy bowl packed with fresh vegetables and protein.','Cooked quinoa:1:cup|Chickpeas:150:g|Avocado:1:|Cherry tomatoes:100:g|Cucumber:1:|Lemon juice:2:tbsp|Olive oil:1:tbsp','Roast the chickpeas for 15 minutes.|Slice the vegetables and avocado.|Arrange everything over the quinoa.|Drizzle with lemon juice and olive oil.',4.5],
 ['Greek Salad','Veg',10,2,u('1540189549336-e6e99c3679fe'),'Crunchy vegetables, olives and feta with a simple lemon dressing.','Cucumber:1:|Tomatoes:3:|Red onion:1:|Feta cheese:100:g|Olives:50:g|Olive oil:2:tbsp|Oregano:1:tsp','Chop the cucumber, tomatoes and onion.|Add olives and crumbled feta.|Dress with olive oil and oregano.|Toss gently and serve chilled.',4.2],
 ['Paneer Butter Masala','Veg',40,4,'','Rich, creamy tomato gravy with soft paneer cubes, best with naan.','Paneer:250:g|Tomatoes:4:|Onion:1:|Butter:2:tbsp|Cream:60:ml|Kasuri methi:1:tsp|Garam masala:1:tsp|Salt:1:tsp','Blend boiled tomatoes and onion into a smooth puree.|Cook the puree in butter with the spices for 10 minutes.|Add the cream and paneer and simmer for 5 minutes.|Finish with kasuri methi and serve hot.',4.9],
 ['Chocolate Brownies','Dessert',35,8,'','Fudgy, chocolatey brownies with a crackly top.','Dark chocolate:150:g|Butter:100:g|Sugar:150:g|Eggs:2:|Flour:80:g|Cocoa powder:2:tbsp','Melt the chocolate and butter together.|Whisk in the sugar and eggs.|Fold in the flour and cocoa.|Bake at 180 C for 25 minutes and cool before cutting.',4.6]
];
await mongoose.connect(process.env.MONGO_URI);
await Recipe.deleteMany();
let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
if (!admin) admin = await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10), role: 'admin' });
await Recipe.insertMany(data.map(([title, category, cookTime, servings, image, description, ing, steps, rating]) => ({
  title, category, cookTime, servings, image, description, rating, numReviews: Math.floor(rating * 12),
  ingredients: ing.split('|').map(x => { const [name, qty, unit] = x.split(':'); return { name, qty: +qty, unit }; }),
  steps: steps.split('|'), author: admin._id, authorName: 'Admin'
})));
console.log('Seeded', data.length, 'recipes + admin'); process.exit();
