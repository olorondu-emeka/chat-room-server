import promise from 'bluebird';
import models from '../database/models';
import { serverError, serverResponse } from '../helper';

const { Chatroom } = models;

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
}
