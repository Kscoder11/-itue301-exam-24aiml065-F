// Last middleware in the chain. Four arguments => Express treats it as an error handler.
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let details;

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map((fieldError) => fieldError.message);
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${error.path}: ${error.value}`;
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value: a record with this unique field already exists';
  }

  const responseBody = { success: false, error: message };
  if (details) {
    responseBody.details = details;
  }

  res.status(statusCode).json(responseBody);
};

export default errorHandler;
