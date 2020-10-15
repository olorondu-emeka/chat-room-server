import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { getNewChatroom, getNewUser } from './__mocks__';

chai.use(chaiHttp);

const newChatroom = getNewChatroom();
const newUser = getNewUser();

let createdUser;

describe('Setup User', () => {
  it('should register a new user successfully', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser });

    createdUser = response.body;

    expect(response).to.have.status(201);
    expect(response.body.token).to.be.a('string');
  });

  it('should throw an error for an already existing user', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser });

    expect(response).to.have.status(409);
  });
});

describe('Setup Chatroom', () => {
  it('should successfully create a new chatroom from a given user', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/chatroom')
      .send({ ...newChatroom })
      .set('Authorization', createdUser.token);

    expect(response).to.have.status(201);
  });

  it('should throw an error for an already existing chatroom', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/chatroom')
      .send({ ...newChatroom })
      .set('Authorization', createdUser.token);

    expect(response).to.have.status(409);
  });
});
