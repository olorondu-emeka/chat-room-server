import express from 'express';
import Users from '../controllers/User';

const router = express.Router();

router.post('/', Users.create);
export default router;
