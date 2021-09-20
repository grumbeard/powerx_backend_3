class CustomError extends Error {
  constructor(message, cause) {
    super();
    this.cause = cause;
    this.message = message;
  }
}

function handleError(err, res) {
  const {message, cause} = err;
  console.log(message);
  if (cause === 'malformed-request') {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      cause,
      message
    });
  } else if (cause === 'unauthorized') {
    res.status(401).json({
      status: 'error',
      statusCode: 401,
      cause,
      message
    });
  } else {
    console.log('Some err occured');
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      cause: cause || 'Unspecified',
      message
    });
  }
}

module.exports = { CustomError, handleError }