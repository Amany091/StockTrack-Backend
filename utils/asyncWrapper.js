const ApiError = require("../utils/apiError");

module.exports = (asyncFn) => {
  return (req, res, next) => {
    Promise.resolve(asyncFn(req, res, next)).catch((error) =>
      next(new ApiError(error.message, 500))
    );
  };
};
