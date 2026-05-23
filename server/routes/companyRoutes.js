import { Router } from 'express';
import { createCompany, getAllCompanies, getCompanyById } from '../controllers/companyController.js';

const router = Router();

router.route('/').get(getAllCompanies).post(createCompany);
router.route('/:id').get(getCompanyById);

export default router;
