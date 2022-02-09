/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */

  // Should be 200 unless err.statusCode or err.status
  // see http://expressjs.com/en/guide/error-handling.html
  res.status(err.status)
  res.json({
    message: err.message,
    code: err.code || null
  });
}

module.exports = {
  errorHandler
};
