import bcrypt from 'bcryptjs';
import models from '../database/models';
import { serverResponse, serverError } from '../helper/serverResponse';
import { generateToken, expiryDate, getUserAgent } from '../helper';

const { Session, User } = models;
/**
 *
 *
 * @class Sessions
 */
class Sessions {
  /**
   *
   *
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @memberof User
   * @returns {json}  object
   */
  static async create(req, res) {
    try {
      const { username, password } = req.body;
      let user = await User.findOne({
        where: { username }
      });
      if (!user) {
        return serverResponse(req, res, 404, { message: 'user does not exist' });
      }

      user = user.dataValues;
      let verifyPassword;
      if (user) verifyPassword = bcrypt.compareSync(password, user.password);

      if (!user || !verifyPassword) {
        return serverResponse(req, res, 401, {
          message: 'incorrect username or password'
        });
      }
      const { devicePlatform, userAgent } = getUserAgent(req);
      const { id } = user;
      delete user.password;
      const expiresAt = expiryDate(devicePlatform);
      const newtoken = generateToken({ id });
      const session = await Session.findOrCreate({
        where: { userId: id, active: true },
        defaults: {
          userId: id,
          token: newtoken,
          expiresAt,
          userAgent,
          devicePlatform
        }
      });
      const { token } = session[0].dataValues;
      res.set('Authorization', token);
      return serverResponse(req, res, 200, { ...user, token });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   *
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @memberof Sessions
   * @returns {json}  object
   */
  static async destroy(req, res) {
    try {
      const token = req.headers.authorization;
      await Session.update(
        { active: false },
        { where: { token }, individualHooks: true }
      );
      return serverResponse(req, res, 200, { message: 'sign out successful' });
    } catch (error) {
      serverError(req, res, error);
    }
  }
}

export default Sessions;
