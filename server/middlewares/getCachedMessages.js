/* eslint-disable no-console */
import { promisify } from 'util';
import { redisConfig, serverError, serverResponse } from '../helper';
import models from '../database/models';

const { Chatroom, ChatroomMessageCheckpoint } = models;

/**
 * retrieves cached messages from redis
 * @name getCachedMessages
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next next object
 * @returns {json} json object containing the cached messages
 */
const getCachedMessages = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    next();
    return;
  }
  const redisClient = redisConfig.getClient();
  const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);

  try {
    const { id: chatroomId } = req.params;
    const { id: userId } = req.user;

    let chatroomMessages = await lrangeAsync(
      `chatroomMessage__chatroomId:${chatroomId}__userId:${userId}`,
      0,
      -1
    );

    if (!chatroomMessages.length) {
      next();
      return;
    }

    const chatroom = await Chatroom.findOne({
      where: {
        id: chatroomId
      }
    });

    if (!chatroom) {
      return serverResponse(req, res, 404, { message: 'chatroom does not exist' });
    }

    const checkpoint = await ChatroomMessageCheckpoint.findOne({
      where: {
        userId,
        chatroomId
      }
    });

    if (!checkpoint) {
      next();
      return;
    }

    let userLastMessageId;
    if (checkpoint !== null) {
      userLastMessageId = checkpoint.dataValues.lastMessageId;
    }
    const { lastMessageId: chatroomLastMessageId } = chatroom.dataValues;

    chatroomMessages = chatroomMessages.map((message) => JSON.parse(message));
    if (chatroomLastMessageId !== userLastMessageId) {
      req.previouslyCachedMessages = chatroomMessages;
      req.userLastMessageId = userLastMessageId;
      next();
    } else {
      return serverResponse(req, res, 200, { messages: chatroomMessages });
    }
  } catch (error) {
    console.log(error);
    return serverError(req, res, error);
  }
};

export default getCachedMessages;
