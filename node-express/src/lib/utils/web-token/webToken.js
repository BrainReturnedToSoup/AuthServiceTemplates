import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

import errors from "../../errors/util/web-token";
import errorEnums from "../../enums/error/util/web-token";
const { TokenError } = errors;

const webToken = {
  sign: function (payload) {
    try {
      return jwt.sign(payload, "SECRET KEY HERE");
    } catch (error) {
      errorHandler(error);
    }
  },

  verify: function (token) {
    try {
      return jwt.verify(token, "SECRET KEY HERE");
    } catch (error) {
      errorHandler(error);
    }
  },
};

//specific to the jsonwebtoken library
function errorHandler(error) {
  console.error(error);

  switch (true) {
    case error instanceof TokenExpiredError:
      throw new TokenError(errorEnums.EXPIRED);

    case error instanceof JsonWebTokenError:
      throw new TokenError(errorEnums.INVALID);

    case error instanceof NotBeforeError:
      throw new TokenError(errorEnums.NOT_BEFORE);

    default:
      throw new TokenError(errorEnums.UNKNOWN);
  }
}

export default webToken;
