import { Router } from 'express';
import { auth } from '../middlewares/auth'
import { getStockList, getStockCandles } from '../controllers/stock.controller'

const router: Router = Router();

// TODO: Add auth middleware
router.get('/', getStockList)
router.post('/candle', getStockCandles)

export default router
