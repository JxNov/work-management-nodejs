const { getUser } = require('../services/user.service');
const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const redis = require('../utils/redis');
module.exports = async (req, res, next) => {
  try {
    const accessToken = req.get('Authorization')?.split(' ').slice(-1).join();
    const { userId } = verifyAccessToken(accessToken);

    // Verify if the access token is blacklisted
    await redis.connect();
    const blacklist = await redis.get(`Blacklist:${accessToken}`);
    await redis.close();

    if (blacklist) {
      throw new Error('Unauthorize');
    }

    const user = await getUser(userId);
    req.user = user;
    req.accessToken = accessToken;
    next();
  } catch (error) {
    return errorResponse({
      res,
      status: 401,
      message: 'Unauthorize',
      errors: error.message,
    });
  }
};
