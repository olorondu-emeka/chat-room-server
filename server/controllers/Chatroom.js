/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import promise from 'bluebird';
import { promisify } from 'util';
import models from '../database/models';
import {
  serverError, serverResponse, socketIO, get24hrTime
} from '../helper';
import redisConfig from '../helper/redisConfig';

const { User, Chatroom, ChatroomMessage } = models;

/**
 * @name convertToBoolean
 * @param {String} string
 * @returns {Boolean} boolean
 */
function convertToBoolean(string) {
  if (string === 'true') return true;
  if (string === 'false') return false;
  return null;
}

/**
 * @class Chatrooms
 *
 */
export default class Chatrooms {
  /**
   * @static
   * @memberof Chatrooms
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async create(req, res) {
    try {
      const { id } = req.user;
      const { name, description } = req.body;
      const possibleChatroom = await Chatroom.findOne({
        where: { name }
      });

      if (possibleChatroom) {
        return serverResponse(req, res, 409, {
          message: 'this chatroom already exists'
        });
      }

      const createdChatroom = await Chatroom.create({
        adminId: id,
        name,
        description
      });

      await createdChatroom.addUsers(id);

      return serverResponse(req, res, 201, { ...createdChatroom.dataValues });
    } catch (error) {
      // console.log(error);
      return serverError(req, res, error);
    }
  }

  /**
   * @static
   * @memberof Chatrooms
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async addMembers(req, res) {
    try {
      const { id } = req.user;
      const { chatroomId, memberIdArray } = req.body;
      const io = socketIO.getIO();
      // const usersObject = {};

      const possibleChatroom = await Chatroom.findOne({
        where: {
          id: chatroomId
        }
      });

      // console.log(possibleChatroom, chatroomId);

      if (!possibleChatroom) {
        return serverResponse(req, res, 404, {
          message: 'chatroom does not exist'
        });
      }

      const { adminId } = possibleChatroom.dataValues;
      if (adminId !== id) {
        return serverResponse(req, res, 403, {
          message: 'user cannot perform this operation'
        });
      }

      await promise.map(
        memberIdArray,
        async (memberId) => {
          await possibleChatroom.addUsers(memberId);
        },
        { concurrency: 1 }
      );

      io.sockets.emit('join chatroom', {
        memberIdArray,
        chatroom: possibleChatroom.dataValues
      });

      return serverResponse(req, res, 201, {
        message: 'members added successfully'
      });
    } catch (error) {
      // console.log(error);
      return serverError(req, res, error);
    }
  }

  /**
   * @static
   * @memberof Chatrooms
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async getAllMembers(req, res) {
    try {
      // eslint-disable-next-line no-unused-vars
      let { members } = req.query;
      const { id: userId } = req.user;
      const { id } = req.params;
      members = convertToBoolean(members);

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

      const { adminId } = possibleChatroom.dataValues;
      if (userId !== adminId) {
        return serverResponse(req, res, 403, {
          message: 'user cannot perform this operation'
        });
      }

      let idArray = await User.findAndCountAll({
        attributes: ['id', 'username']
      });
      idArray = idArray.rows.map((user) => user.dataValues);

      let chatroomUsers = await possibleChatroom.getUsers();
      chatroomUsers = chatroomUsers.map((user) => ({
        id: user.dataValues.id,
        username: user.dataValues.username
      }));

      const idObject = {};
      for (let i = 0; i < chatroomUsers.length; i++) {
        idObject[chatroomUsers[i].id] = true;
      }

      let finalUsers;
      // if members is true, return chatroom members only
      if (members) {
        finalUsers = chatroomUsers;
      } else {
        // return users that are not chatroom members
        finalUsers = idArray.filter((user) => !idObject[user.id]);
      }

      return serverResponse(req, res, 200, {
        users: finalUsers
      });
    } catch (error) {
      // console.log(error);
      return serverError(req, res, error);
    }
  }

  /**
   * @static
   * @memberof Chatrooms
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async sendChatroomMessage(req, res) {
    try {
      const { id } = req.user;
      const { chatroomId, message } = req.body;
      const io = socketIO.getIO();

      // const possibleChatroom = await Chatroom.findOne({
      //   where: {
      //     id: chatroomId
      //   }
      // });

      // if (!possibleChatroom) {
      //   return serverResponse(req, res, 404, {
      //     message: 'chatroom does not exist'
      //   });
      // }

      // let chatroomUsers = await possibleChatroom.getUsers();
      // chatroomUsers = chatroomUsers.map((user) => ({
      //   id: user.dataValues.id,
      //   username: user.dataValues.username
      // }));

      // // validate that the user is a member of the chatroom
      // const isMember = chatroomUsers.some((user) => user.id === id);
      // if (!isMember) {
      //   return serverResponse(req, res, 403, {
      //     message: 'user cannot perform this operation'
      //   });
      // }

      const createdChatroomMessage = await ChatroomMessage.create({
        senderId: id,
        chatroomId,
        content: message.trim(),
        timestamp: get24hrTime(new Date().getHours(), new Date().getMinutes())
      });

      const { id: createdMessageId } = createdChatroomMessage.dataValues;

      const possibleChatroomMessage = await ChatroomMessage.findOne({
        where: {
          id: createdMessageId
        },
        attributes: ['id', 'content', 'timestamp'],
        include: [
          {
            model: User,
            attributes: ['id', 'username']
          }
        ]
      });

      io.sockets.emit('chatroom message', {
        chatroomId,
        message: possibleChatroomMessage.dataValues
      });

      return serverResponse(req, res, 201, {
        message: createdChatroomMessage.dataValues.content
      });
    } catch (error) {
      console.log(error);
      return serverError(req, res, error);
    }
  }

  /**
   * @static
   * @memberof Chatrooms
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async getChatroomMessages(req, res) {
    try {
      const { id } = req.params;
      const redisClient = redisConfig.getClient();
      const lpushAsync = promisify(redisClient.lpush).bind(redisClient);
      const cachedMessages = [];

      // const possibleChatroom = await Chatroom.findOne({
      //   where: {
      //     id
      //   }
      // });

      // if (!possibleChatroom) {
      //   return serverResponse(req, res, 404, {
      //     message: 'chatroom does not exist'
      //   });
      // }

      // let chatroomUsers = await possibleChatroom.getUsers();
      // chatroomUsers = chatroomUsers.map((user) => ({
      //   id: user.dataValues.id,
      //   username: user.dataValues.username
      // }));

      // // validate that the user is a member of the chatroom
      // const isMember = chatroomUsers.some((user) => user.id === userId);
      // if (!isMember) {
      //   return serverResponse(req, res, 403, {
      //     message: 'user cannot perform this operation'
      //   });
      // }

      let chatroomMessages = await ChatroomMessage.findAndCountAll({
        where: {
          chatroomId: id
        },
        attributes: ['id', 'content', 'timestamp'],
        include: [
          {
            model: User,
            attributes: ['id', 'username']
          }
        ]
      });
      chatroomMessages = chatroomMessages.rows.map((message) => {
        cachedMessages.push(JSON.stringify(message));
        return message.dataValues;
      });

      // save in redis
      if (process.env.NODE_ENV !== 'test') {
        await lpushAsync(
          `chatroomMessage__chatroomId:${id}`,
          ...cachedMessages
        );
      }

      return serverResponse(req, res, 200, { messages: chatroomMessages });
    } catch (error) {
      console.log(error);
      return serverError(req, res, error);
    }
  }

  /**
   * @static
   * @memberof Chatrooms
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async getAllChatrooms(req, res) {
    try {
      const { id } = req.user;
      let allChatrooms = await Chatroom.findAndCountAll({
        attributes: ['id', 'adminId', 'name', 'description']
      });
      allChatrooms = allChatrooms.rows;
      // allChatrooms = allChatrooms.rows.map((chatroom) => chatroom.dataValues);
      if (allChatrooms.length === 0) {
        return serverResponse(req, res, 200, { chatrooms: allChatrooms });
      }

      // an array of objects, where each object is key-value pairs of all the members of a particular chatroom
      const chatroomArray = [];

      // return all chatrooms that the user is a member of

      // TODO: optimize from 0(n*n) to 0(n)
      await promise.map(
        allChatrooms,
        async (chatroom) => {
          // chatroomObject[chatroom.id] = chatroom.dataValues;
          const chatroomMembers = await chatroom.getUsers({
            attributes: ['id', 'username']
          });
          // chatroomAndMembers[chatroom.id] = chatroomMembers;
          const isMember = chatroomMembers.some((user) => user.id === id);
          if (isMember) {
            chatroomArray.push(chatroom);
          }
        },
        { concurrency: 1 }
      );
      // console.log(chatroomArray);

      // for (let key of chatroomObject)
      return serverResponse(req, res, 200, { chatrooms: chatroomArray });
    } catch (error) {
      // console.log(error);
      return serverError(req, res, error);
    }
  }
}
