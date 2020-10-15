import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { getNewChatroom, getNewUser } from './__mocks__';

chai.use(chaiHttp);

const newChatroom = getNewChatroom();
const newUser = getNewUser();
const newUser2 = getNewUser();
const newUser3 = getNewUser();

let createdUser, createdChatroom, newChatroomMember1, newChatroomMember2;

describe('Setup User', () => {
  it('should register a new user successfully', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser });

    const createdMemberResponse1 = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser2 });

    const createdMemberResponse2 = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser3 });

    createdUser = response.body;
    newChatroomMember1 = createdMemberResponse1.body;
    newChatroomMember2 = createdMemberResponse2.body;

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

    createdChatroom = response.body;
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

describe('Add Chatroom members', () => {
  it('should add chatroom members with the right admin', async () => {
    const memberIdArray = [newChatroomMember1.id, newChatroomMember2.id];
    const response = await chai
      .request(server)
      .post('/api/v1/chatroom/add-members')
      .set('Authorization', createdUser.token)
      .send({ chatroomId: createdChatroom.id, memberIdArray });

    expect(response).to.have.status(201);
  });

  it('should throw an unauthorized error if a wrong admin tries to add members', async () => {
    const memberIdArray = [newChatroomMember1.id, newChatroomMember2.id];
    const response = await chai
      .request(server)
      .post('/api/v1/chatroom/add-members')
      .set('Authorization', newChatroomMember1.token)
      .send({ chatroomId: createdChatroom.id, memberIdArray });

    expect(response).to.have.status(403);
  });
});
