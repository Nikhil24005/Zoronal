import { Router } from 'express';
import { addReview, getReviewsByCompany, likeReview } from '../controllers/reviewController.js';

const router = Router();

router.route('/').post(addReview);
router.route('/:companyId').get(getReviewsByCompany);
router.route('/:id/like').patch(likeReview);

export default router;
