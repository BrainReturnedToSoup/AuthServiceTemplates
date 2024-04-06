import models from "../../models/verify";
import errorHandler from "./errorHandler";

import decryptGrantID from "../../../lib/utils/crypto/web-token/decrypt/grantID";
import idGenerator from "../../../lib/utils/id-generator/idGenerator";
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
 *  Data within it.
 *
 *  Additionally, all of decrypted and already interpretable information from the token
 *  is wrapped in an object as saved into the req object.
 *
 *  req.tokenData = token data object
 */
async function decryptTokenPayload(req) {
  const { grantID } = req.decodedToken;

  req.decrypted = decryptGrantID(grantID);
}

/*  The JTI associated with the record containing the in-app session is retrieved
 *
 *  The successful retrieval of the record means that the token is partially valid at this point,
 *  but the JTI comparison still needs to be made.
 *
 *  req.storedJti = retrieved JTI.
 */
async function getStoredJti(req) {
  const { decrypted } = req;

  req.storedJti = await models.getJti(decrypted);
}

/*  The JTI saved in req.storedJti is compared with the JTI saved in the decoded token
 *
 *  If the comparison reveals a mismatch, then a custom error is thrown.
 *
 *  This function does not create any new information to be used by proceeding functions.
 */
function compareJti(req) {
  const { jti } = req.decodedToken,
    { storedJti } = req;

  if (jti !== storedJti)
    throw new DoesNotMatchError(errorEnums.DoesNotMatchError.JTI);
}

/*  At this point, the original token is completely valid, thus it is time to generate a new token
 *  for the recipient to use next time they need a verification.
 *
 *  The operations of a new token generated is as follows.
 *    1. Generate a new JTI
 *    2. Overwrite the old JTI currently saved in the DB with the new JTI
 *    3. Create a new JWT token that copies over the encrypted grant ID, the exp, and adds the new JTI
 *
 *  The new token is stored into the req object.
 *
 *  req.newToken = new token created.
 */
async function generateNewToken(req) {
  const { grantID } = req.decodedToken;

  const newJti = idGenerator();

  await models.updateJti(grantID, newJti);

  req.tokenData.jti = newJti;

  req.newToken = webToken.sign(req.tokenData);
}

/*  Finally, the new token created can now be sent back to the user using the res body
 * as JSON. This also includes a corresponding status code for this specific
 *  request success
 *
 * res.body.newToken = new token created.
 */
function respond(req, res) {
  const { newToken } = req;

  res.status("CODE GOES HERE").json({ newToken });
}

export default async function verify(req, res) {
  try {
    validateInput(req, res);
    await decryptTokenPayload(req, res);
    await getStoredJti(req, res);
    compareJti(req, res);
    await generateNewToken(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
