import generateToken from './generateToken';
import getUserAgent from './getUserAgent';
import serverResponses from './serverResponse';
import expiryDate from './expiryDate';

const { serverError, serverResponse } = serverResponses;

export {
  serverResponse, serverError, generateToken, getUserAgent, expiryDate
};
