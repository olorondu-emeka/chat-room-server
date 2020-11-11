/* eslint-disable no-console */
import { serverError, serverResponse } from '../helper';
import models from '../database/models';

const { Chatroom } = models;

/**
 * retrieves cached messages from redis
 * @name getCachedMessages
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next next object
 * @returns {json} json object containing the cached messages
 */
const verifyChatroomMembers = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    let { id } = req.params;
    const { chatroomId } = req.body;

    id = id || chatroomId;

    const possibleChatroom = await Chatroom.findOne({
      where: {
        id
      }
    });

    if (!possibleChatroom) {
      return serverResponse(req, res, 404, {
        message: 'chatroom does not exist'
      });
    }

    let chatroomUsers = await possibleChatroom.getUsers();
    chatroomUsers = chatroomUsers.map((user) => ({
      id: user.dataValues.id,
      username: user.dataValues.username
    }));

    // validate that the user is a member of the chatroom
    const isMember = chatroomUsers.some((user) => user.id === userId);
    if (!isMember) {
      return serverResponse(req, res, 403, {
        message: 'user cannot perform this operation'
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return serverError(req, res, error);
  }
};

export default verifyChatroomMembers;
