import express from 'express';
import verifyToken from '../middlewares/verifyToken';
import Session from '../controllers/Sessions';

const route = express.Router();

route.post('/create', Session.create);
route.post('/destroy', verifyToken, Session.destroy);

export default route;
