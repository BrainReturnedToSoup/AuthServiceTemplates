import errorHandler from "./errorHandler";
import models from "../../models/users/verify";

function validateInput(req, res) {
  /*  validates the supplied token in the req body to ensure the token is a JWT token,
   *  not expired, nor tampered with.
   *
   *  This function should put the decoded token into the
   *  req object if the token is valid on the surface.
   *
   *  req.decodedToken = decoded token
   */
}

async function decryptData(req, res) {
  /*  Takes the decoded token from req.decodedToken and decrypts the corresponding
   *  Data within it.
   *
   *  Additionally, all of decrypted and already interpretable information from the token
   *  is wrapped in an object as saved into the req object.
   *
   *  req.tokenData = token data object
   */
}

async function getJti(req, res) {
  /*  The in-app grant record associated with the token is fetched using a custom model abstraction. This includes
   *  the relevant data, such as the user ID and the JTI for that specific grant session.
   *
   *  The successful retrieval of the record means that the token is partially valid at this point,
   *  but the JTI comparison still needs to be made.
   *
   *  The JTI within the retrieved record is stored into the req object.
   *
   *  req.storedJti = jti from the retrieved record.
   */
}

function compareJti(req, res) {
  /*  The JTI saved in req.storedJti is compared with the JTI saved in req.tokenData.jti
   *
   *  If the comparison reveals a mismatch, then a custom error is thrown.
   *
   *  This function does not create any new information to be used by proceeding functions.
   */
}

async function generateNewToken(req, res) {
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
}

function respond(req, res) {
  /*  Finally, the new token created can now be sent back to the user using the res body
   * as JSON. This also includes a corresponding status code for this specific
   *  request success
   *
   * res.body.newToken = new token created.
   */
}

export default async function verify(req, res) {
  try {
    validateInput(req, res);
    await decryptData(req, res);
    await getJti(req, res);
    compareJti(req, res);
    await generateNewToken(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
