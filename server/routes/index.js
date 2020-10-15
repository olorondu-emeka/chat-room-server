import express from 'express';
import userRoutes from './user';

const route = express.Router();

route.use('/user', userRoutes);
export default route;
