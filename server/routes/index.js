import express from 'express';
import userRoutes from './user';
import sessionRoutes from './session';
import chatroomRoutes from './chatroom';

const route = express.Router();

route.use('/user', userRoutes);
route.use('/session', sessionRoutes);
route.use('/chatroom', chatroomRoutes);
export default route;
