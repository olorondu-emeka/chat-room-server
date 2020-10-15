import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { getNewUser } from './__mocks__/user';
// import models from '../server/database/models';

const newUser = getNewUser();
// const badUser = getBadUser();

chai.use(chaiHttp);

describe('Setup User', () => {
  it('should register a new user successfully', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser });

    expect(response).to.have.status(201);
  });

  it('should login created user', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/session/create')
      .send({ email: newUser.email, password: newUser.password });

    expect(response).to.have.status(200);
  });

  it('should throw an error for an already existing user', async () => {
    const response = await chai
      .request(server)
      .post('/api/v1/user')
      .send({ ...newUser });

    expect(response).to.have.status(409);
  });
});
