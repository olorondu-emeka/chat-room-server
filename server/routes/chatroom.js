import express from 'express';
import Chatroom from '../controllers/Chatroom';
import verifyToken from '../middlewares/verifyToken';

const route = express.Router();

route.post('/', verifyToken, Chatroom.create);
route.post('/add-members', verifyToken, Chatroom.addMembers);
route.get('/members/:id', Chatroom.getAllMembers);
export default route;
