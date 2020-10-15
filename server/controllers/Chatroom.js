import promise from 'bluebird';
import models from '../database/models';
import { serverError, serverResponse } from '../helper';
// import Users from './User';

const { User, Chatroom } = models;

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

      const possibleChatroom = await Chatroom.findOne({
        where: {
          id: chatroomId
        }
      });

      // console.log(possibleChatroom, chatroomId);

      if (!possibleChatroom) {
        return serverResponse(req, res, 404, { message: 'chatroom does not exist' });
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

      return serverResponse(req, res, 201, {
        message: 'members added successfully'
      });
    } catch (error) {
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
      const { chatroomId } = req.body;
      members = convertToBoolean(members);

      const possibleChatroom = await Chatroom.findOne({
        where: {
          id: chatroomId
        }
      });

      if (!possibleChatroom) {
        return serverResponse(req, res, 404, { message: 'chatroom does not exist' });
      }

      // eslint-disable-next-line no-unused-vars
      let totalMembers;
      // eslint-disable-next-line no-unused-vars
      const idArray = await User.findAndCountAll({
        attributes: {
          exclude: ['username', 'password', 'email', 'createdAt', 'updatedAt']
        }
      });
      const allChatroomMembers = await possibleChatroom.getUsers();
      return serverResponse(req, res, 200, allChatroomMembers);

      // const idObject = {};
      // for(let i = 0; i < idObject.length, i++) {
      //   idObject[]
      // }

      // totalMembers = allMembers.dataValues.length;

      // console.log('all members', allMembers);

      // // retrueve all users that belong to this chatroom
      // if() {

      // } else {

      // }
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}
