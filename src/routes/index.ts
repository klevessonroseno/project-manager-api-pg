import { Router } from 'express';
import publicManagerRoutes from './public/routes';
import privateManagerRoutes from './private/routes';

const router = Router();

router.use(publicManagerRoutes);
router.use(privateManagerRoutes);

export default router;
