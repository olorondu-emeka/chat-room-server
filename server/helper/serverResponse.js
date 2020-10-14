/**
 * @name serverResponse
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @param {Number} code status code to return
 * @param {Ojectb} data object with response details
 * @returns {JSON} JSON response with status and response information
 */
const serverResponse = (req, res, code, data) => {
  res.status(code).json({ ...data });
};

/**
 * @name serverError
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @param {error} error the error message
 * @returns {JSON} JSON response with server error details
 */
const serverError = (req, res, error) => {
  res.status(500).json({
    error
  });
};

module.exports = { serverResponse, serverError };
