import { Router } from 'express';
import {auth} from '../middlewares/auth'
import { register } from '../controllers/user.controller'

const router: Router = Router();

router.post('/register', auth, register)

export default router