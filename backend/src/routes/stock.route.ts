import { Router } from 'express';
import { auth } from '../middlewares/auth'
import { getStockList, getStockCandles, setAlert } from '../controllers/stock.controller'

const router: Router = Router();

// TODO: Add auth middleware
router.get('/', getStockList)
router.post('/candle', getStockCandles)
router.post('/alert', setAlert)

export default router
