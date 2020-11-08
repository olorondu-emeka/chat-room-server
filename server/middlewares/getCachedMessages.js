/* eslint-disable no-console */
import { promisify } from 'util';
import { redisConfig, serverError, serverResponse } from '../helper';

/**
 * retrieves cached messages from redis
 * @name getCachedMessages
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next next object
 * @returns {json} json object containing the cached messages
 */
const getCachedMessages = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') next();
  const redisClient = redisConfig.getClient();
  const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);

  try {
    const { id } = req.params;

    let chatroomMessages = await lrangeAsync(
      `chatroomMessage__chatroomId:${id}`,
      0,
      -1
    );

    if (!chatroomMessages.length) next();
    console.log('chatroom messages', chatroomMessages);

    chatroomMessages = chatroomMessages.map((message) => JSON.parse(message));

    console.log('parsed chatroomMessages', chatroomMessages);

    return serverResponse(req, res, 200, { messages: chatroomMessages });
  } catch (error) {
    console.log(error);
    return serverError(req, res, error);
  }
};

export default getCachedMessages;
