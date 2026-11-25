import { Router } from 'express';
import { toggleFavorite, library } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
const router = Router();
router.use(auth);
router.post('/favorites/:id', toggleFavorite);
router.get('/library', library);
export default router;
