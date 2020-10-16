import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { getNewChatroom, getNewChatroomMessage, getNewUser } from './__mocks__';

chai.use(chaiHttp);

const newChatroom = getNewChatroom();
const newUser = getNewUser();
const newUser2 = getNewUser();
const newUser3 = getNewUser();
const newIsolatedUser = getNewUser();

const createdUserMessage = getNewChatroomMessage();
const createdIsolatedUserMessage = getNewChatroomMessage();

let createdUser,
  createdChatroom,
  newChatroomMember1,
  newChatroomMember2,
  createdIsolatedUser;

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

    const createdIsolatedUserResponse = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newIsolatedUser });

    createdUser = response.body;
    newChatroomMember1 = createdMemberResponse1.body;
    newChatroomMember2 = createdMemberResponse2.body;
    createdIsolatedUser = createdIsolatedUserResponse.body;

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

  it('should throw a 404 error for a non-existent chatroom', async () => {
    const memberIdArray = [newChatroomMember1.id, newChatroomMember2.id];
    const response = await chai
      .request(server)
      .post('/api/v1/chatroom/add-members')
      .set('Authorization', createdUser.token)
      .send({ chatroomId: 0, memberIdArray });

    expect(response).to.have.status(404);
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

describe('Get chatroom members', () => {
  it('should successfully retrieve chatroom members based on given query param', async () => {
    const response = await chai
      .request(server)
      .get(`/api/v1/chatroom/members/${createdChatroom.id}?members=true`)
      .set('Authorization', createdUser.token);

    expect(response).to.have.status(200);
    expect(response.body.users).to.be.an('array');
  });

  it('should throw a 404 for a non-existent chatroom', async () => {
    const response = await chai
      .request(server)
      .get(`/api/v1/chatroom/members/${0}?members=true`)
      .set('Authorization', createdUser.token);

    expect(response).to.have.status(404);
  });

  it('should throw an unauthorized error for get attempt by non-admin', async () => {
    const response = await chai
      .request(server)
      .get(`/api/v1/chatroom/members/${createdChatroom.id}?members=true`)
      .set('Authorization', newChatroomMember1.token);

    expect(response).to.have.status(403);
  });
});

describe('Setup Chatroom messages', () => {
  describe('Send Chatroom message', () => {
    it('should send chatroom message by a member of the chatroom', async () => {
      const response = await chai
        .request(server)
        .post('/api/v1/chatroom/message')
        .set('Authorization', createdUser.token)
        .send({ chatroomId: createdChatroom.id, message: createdUserMessage });

      expect(response).to.have.status(201);
    });

    it('should return a 404 error for a chatroom that does not exist', async () => {
      const response = await chai
        .request(server)
        .post('/api/v1/chatroom/message')
        .set('Authorization', createdUser.token)
        .send({ chatroomId: 0, message: createdUserMessage });

      expect(response).to.have.status(404);
    });

    it('should refuse to send chatroom message by a non-member', async () => {
      const response = await chai
        .request(server)
        .post('/api/v1/chatroom/message')
        .set('Authorization', createdIsolatedUser.token)
        .send({
          chatroomId: createdChatroom.id,
          message: createdIsolatedUserMessage
        });

      expect(response).to.have.status(403);
    });
  });

  // describe('Retrieve Chatroom messages', () => {});
});
