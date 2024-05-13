import webToken from "../../../../src/lib/utils/web-token/webToken";
import webTokenErrors from "../../../../src/lib/errors/util/web-token";
import webTokenErrorEnums from "../../../../src/lib/enums/error/util/webToken";

const { TokenError } = webTokenErrors;

describe("testing for various web token custom errors", () => {
  test("NotBeforeError", async () => {
    const payload = {
      notBefore: Math.floor(Date.now() / 1000) + 10, //10 minutes from the current time of creation
    };

    const token = webToken.sign(payload);

    try {
      webToken.verify(token);
    } catch (error) {
      expect(error).toBeInstanceOf(TokenError);
      expect(error.message).toEqual(webTokenErrorEnums.NOT_BEFORE);
    }
  });

  test("TokenExpiredError", async () => {
    const payload = {
      exp: Math.floor(Date.now() / 1000) - 10, //exp set to 10 minutes prior to the time of creation
    };

    const token = webToken.sign(payload);

    try {
      webToken.verify(token);
    } catch (error) {
      expect(error).toBeInstanceOf(TokenError);
      expect(error.message).toEqual(webTokenErrorEnums.EXPIRED);
    }
  });

  test("JsonWebTokenError", async () => {
    const payload = "invalid token";

    const token = webToken.sign(payload);

    try {
      webToken.verify(token);
    } catch (error) {
      expect(error).toBeInstanceOf(TokenError);
      expect(error.message).toEqual(webTokenErrorEnums.INVALID);
    }
  });
});

describe("testing for output on valid token", () => {
  test("valid", async () => {
    const payload = { exp: Math.floor(Date.now() / 1000) + 10 };

    try {
      webToken.verify(payload);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
