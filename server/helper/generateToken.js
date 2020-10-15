import jwt from 'jsonwebtoken';

/**
 * @name generateToken
 * @param {object} payload
 * @param {String} expiresIn
 * @return {string} token
 */
const generateToken = (payload, expiresIn) => {
  if (!expiresIn) return jwt.sign(payload, process.env.JWT_KEY);
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn });
};

export default generateToken;
