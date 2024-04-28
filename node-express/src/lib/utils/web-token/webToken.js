import jwt from "jsonwebtoken";
import errors from "../../errors/util/web-token";
import errorEnums from "../../enums/error/util/webToken";
const { TokenError } = errors;

const webToken = {
  sign: function (payload) {
    try {
      return jwt.sign(payload, process.env.WEB_TOKEN_KEY);
    } catch (error) {
      errorHandler(error);
    }
  },

  verify: function (token) {
    try {
      return jwt.verify(token, process.env.WEB_TOKEN_KEY);
    } catch (error) {
      errorHandler(error);
    }
  },
};

//specific to the jsonwebtoken library
function errorHandler(error) {
  console.error(error);

  switch (true) {
    case error instanceof jwt.TokenExpiredError:
      throw new TokenError(errorEnums.EXPIRED);

    case error instanceof jwt.JsonWebTokenError:
      throw new TokenError(errorEnums.INVALID);

    case error instanceof jwt.NotBeforeError:
      throw new TokenError(errorEnums.NOT_BEFORE);

    default:
      throw new TokenError(errorEnums.UNKNOWN);
  }
}

export default webToken;
