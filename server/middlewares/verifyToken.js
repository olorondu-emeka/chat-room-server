const jwt = require('jsonwebtoken');
const { serverResponse, serverError } = require('../helper/serverResponse');
const models = require('../database/models');

const { User, Session } = models;
/**
 * @name verifyToken
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @return {string} object
 */
const verifyToken = async (request, response, next) => {
  try {
    const token = request.headers.authorization || request.query.token;
    if (!token || (token === 'null')) {
      return serverResponse(request, response, 401, { message: 'kindly login to proceed' });
    }
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id, models);
    if (!user) {
      return serverResponse(request, response, 404, {
        message: 'user does not exist'
      });
    }
    request.user = user;
    response.locals.token = token;
    next();
  } catch (err) {
    if (err.message === 'jwt expired') {
      const token = request.headers.authorization || request.query.token;
      await Session.update({ active: false }, { where: { token }, individualHooks: true });
    }
    return serverError(request, response, err.message === 'jwt expired'
      ? 'kindly login again' : 'auth credentials not valid');
  }
};

export default verifyToken;
