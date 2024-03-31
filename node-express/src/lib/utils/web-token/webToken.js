import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import webTokenErrors from "../../errors/util/web-token";

const { TokenError, enums } = webTokenErrors;

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
  switch (true) {
    case error instanceof TokenExpiredError:
      throw new TokenError(enums.EXPIRED);

    case error instanceof JsonWebTokenError:
      console.error(error);
      throw new TokenError(enums.INVALID);

    case error instanceof NotBeforeError:
      throw new TokenError(enums.NOT_BEFORE);

    default:
      console.error(error);
      throw new TokenError(enums.UNKNOWN);
  }
}

export default webToken;
