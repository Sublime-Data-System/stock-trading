import { Router } from 'express';
import userRoutes from './user.route'
import stockRoutes from './stock.route'

const router: Router = Router();

router.use('/users', userRoutes)
router.use('/stock', stockRoutes)

export default router
