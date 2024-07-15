import { Router } from 'express';
import { auth } from '../middlewares/auth'
import { getStockList, getStockCandles, setAlert } from '../controllers/stock.controller'

const router: Router = Router();

// TODO: Add auth middleware
router.get('/', auth, getStockList)
router.post('/candle', auth, getStockCandles)
router.post('/alert', auth, setAlert)

export default router
