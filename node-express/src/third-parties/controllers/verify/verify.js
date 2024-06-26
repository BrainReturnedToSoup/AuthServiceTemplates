import errorHandler from "./errorHandler";
import models from "../../models/verify";
import decryptGrantID from "../../../lib/utils/crypto/web-token/decrypt/grantID";
import decryptThirdPartyID from "../../../lib/utils/crypto/web-token/decrypt/thirdPartyID";
import webToken from "../../../lib/utils/web-token/webToken";
import errors from "../../../lib/errors/controller";
import errorEnums from "../../../lib/enums/error/controller";
const { DoesNotMatchError } = errors;

/*  validates the supplied token in the req body to ensure the token is a JWT token,
 *  not expired, nor tampered with.
 *
 *  This function should put the decoded token into the
 *  req object if the token is valid on the surface.
 *
 *  req.decodedToken = decoded token
 */
function validateInput(req) {
  const { token } = req.body;

  req.decodedToken = webToken.verify(token);
}

/*  Takes the decoded token from req.decodedToken and decrypts the corresponding
 *  Data within it. This includes the encrypted grant ID and third-party ID.
 *
 *  Additionally, all of decrypted and already interpretable information from the token
 *  is wrapped in an object as saved into the req object.
 *
 *  req.tokenData = token data object
 */
async function decryptTokenPayload(req) {
  const { grantID, thirdPartyID } = req.decodedToken;

  req.tokenData = {
    thirdPartyID: await decryptThirdPartyID(thirdPartyID),
    grantID: await decryptGrantID(grantID),
  };
}

/*  The third-party session record associated with the token is fetched using the grant ID with a custom model abstraction.
 *  This includes the relevant data, such as the grant ID and third-party ID for that specific grant session.
 *
 *  The retrieved third-party ID is stored in the req object under the thirdPartyID
 *
 *  req.thirdPartyID = retrieved third-party ID
 */
async function getSessionIDs(req) {
  const { grantID } = req.tokenData;

  req.sessionData = await models.getSessionIDs(grantID);
}

/*  takes the third-party ID from the req body and compares such to the
 *  retrieved third-party ID from the req.sessionData.
 *
 *  Only throws custom errors, does not add any new data to the req object.
 */
function compareThirdPartyID(req) {
  if (req.tokenData.thirdPartyID !== req.sessionData.thirdPartyID)
    throw new DoesNotMatchError(errorEnums.DoesNotMatchError.THIRD_PARTY_ID);
}

/*  takes the third-party ID from the req body and compares such to the
 *  retrieved third-party ID from the req.sessionData.
 *
 *  Only throws custom errors, does not add any new data to the req object.
 */
async function verifyUserID(req) {
  const { userID } = req.sessionData;

  await models.verifyUserID(userID);
}

/*  Finally, a request demonstrating the success of the deletion is sent. This is
 *  achieved purely with response status codes corresponding to this route success.
 */
function respond(res) {
  //successful but no body content. third-party tokens do not get refreshed like user tokens
  res.status(204).end();
}

export default async function verify(req, res) {
  try {
    validateInput(req);
    await decryptTokenPayload(req);
    await getSessionIDs(req);
    compareThirdPartyID(req);
    await verifyUserID(req);
    respond(res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
