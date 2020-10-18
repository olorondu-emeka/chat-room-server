import bcrypt from 'bcryptjs';
import models from '../database/models';
import {
  generateToken,
  serverError,
  serverResponse,
  expiryDate,
  getUserAgent
} from '../helper';

const { User, Session } = models;

/**
 * @class Users
 */
export default class Users {
  /**
   * @static
   * @memberof Users
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Json} json object returned
   */
  static async create(req, res) {
    try {
      const { username, password } = req.body;
      const possibleUser = await User.findByUsername(username);

      if (possibleUser) {
        return serverResponse(req, res, 409, {
          message: 'user already exists'
        });
      }

      const possibleUserWithUsername = await User.findOne({
        where: { username }
      });

      if (possibleUserWithUsername) {
        return serverResponse(req, res, 409, {
          message: 'username has already been taken'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await User.create({
        username,
        password: hashedPassword
      });

      const { id } = createdUser;
      const token = generateToken({ id }, '24h');
      const { devicePlatform, userAgent } = getUserAgent(req);
      const expiresAt = expiryDate(devicePlatform);
      await Session.create({
        userId: id,
        token,
        expiresAt,
        userAgent,
        devicePlatform
      });

      const data = { ...createdUser.dataValues, token };
      delete data.password;

      return serverResponse(req, res, 201, { ...data });
    } catch (error) {
      // console.log(error);
      return serverError(req, res, error);
    }
  }
}
