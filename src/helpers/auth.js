const jwt = require('jwt-simple');
const moment = require('moment');

function checkHeaderToken(req, res, next) {
  const auth = req.headers.authorization
    ? req.headers.authorization
    : req.headers.Authorization;

  if (auth && auth.indexOf('Bearer ') > -1) {
    const arr = auth.split('Bearer ');
    let token = arr[1];

    // token = token.replace(/[\W_]+/g, '');

    console.log({ token });
    if (token && token.length > 0) {
      try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const { userId, expired } = decoded;
        console.log({ userId, expired });
        if (userId > 0 && expired > moment().unix()) {
          req.userId = userId;
          return next();
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return res.status(403).send({
    message: 'access denied',
  });
}

function generateToken(userId) {
  const payload = {
    userId,
    expired: moment().unix() + 3600,
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
}

module.exports = {
  generateToken,
  checkHeaderToken,
};
