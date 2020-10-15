import express from 'express';
import Chatroom from '../controllers/Chatroom';
import verifyToken from '../middlewares/verifyToken';

const route = express.Router();

route.post('/', verifyToken, Chatroom.create);
export default route;