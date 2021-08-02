const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  let payload = {
    sub: userId,
    type: type,
    exp: expires,
  };

  try {
    const accessToken = jwt.sign(payload, secret);
    return accessToken;
  } catch (err) {
    throw err;
  }
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  const exp = config.jwt.accessExpirationMinutes * 60;
  // console.log(token);
  const time = new Date();
  const secs = Math.floor(time / 1000) + exp;
  time.setSeconds(time.getSeconds() + exp);
  try {
    const accessToken = await generateToken(
      user._id,
      secs,
      tokenTypes.ACCESS,
      config.jwt.secret
    );

    const data = {
      access: {
        token: accessToken,
        expires: time,
      },
    };
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
