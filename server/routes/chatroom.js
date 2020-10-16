import express from 'express';
import Chatroom from '../controllers/Chatroom';
import verifyToken from '../middlewares/verifyToken';

const route = express.Router();

route.post('/', verifyToken, Chatroom.create);
route.post('/add-members', verifyToken, Chatroom.addMembers);
route.post('/message', verifyToken, Chatroom.sendChatroomMessage);

route.get('/members/:id', verifyToken, Chatroom.getAllMembers);
route.get('/message/:id', verifyToken, Chatroom.getChatroomMessages);
export default route;
