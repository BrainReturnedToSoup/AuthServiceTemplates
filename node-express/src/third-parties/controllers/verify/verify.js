import errorHandler from "./errorHandler";
import models from "../../models/verify";

import decryptThirdPartyID from "../../../lib/utils/cryptography/decrypt/thirdPartyID";
import decryptGrantID from "../../../lib/utils/cryptography/decrypt/grantID";

import jwt from "jwt";

import { DoesNotMatch, enums } from "../../../lib/errors/controller";

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

  req.decodedToken = jwt.verify(token, "SECRET KEY HERE");
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

  req.tokenData.thirdPartyID = decryptThirdPartyID(thirdPartyID);
  req.tokenData.grantID = decryptGrantID(grantID);
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
    throw new DoesNotMatch(enums.DoesNotMatch.THIRD_PARTY_ID);
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
  res.status("CODE GOES HERE");
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
