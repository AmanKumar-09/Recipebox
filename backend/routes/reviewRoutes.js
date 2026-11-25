import { Router } from 'express';
import { list, create } from '../controllers/reviewController.js';
import { auth } from '../middleware/auth.js';
const router = Router({ mergeParams: true }); // mounted at /api/recipes/:id/reviews
router.get('/', list);
router.post('/', auth, create);
export default router;
