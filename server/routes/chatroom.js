import express from 'express';
import Chatroom from '../controllers/Chatroom';
import {
  verifyToken,
  verifyChatroomMember,
  getCachedMessages
} from '../middlewares';

const route = express.Router();

route.post('/', verifyToken, Chatroom.create);
route.post('/add-members', verifyToken, Chatroom.addMembers);
route.post(
  '/message',
  verifyToken,
  verifyChatroomMember,
  Chatroom.sendChatroomMessage
);

route.patch(
  '/:id/checkpoint',
  verifyToken,
  verifyChatroomMember,
  Chatroom.updateCheckpoint
);

route.get('/members/:id', verifyToken, Chatroom.getAllMembers);
route.get(
  '/message/:id',
  verifyToken,
  verifyChatroomMember,
  getCachedMessages,
  Chatroom.getChatroomMessages
);
route.get('/', verifyToken, Chatroom.getAllChatrooms);
export default route;
