import errorHandler from "./errorHandler";
import models from "../../models/authenticate";

import validateEmailUsername from "../../../lib/utils/input-validators/emailUsername";
import validatePassword from "../../../lib/utils/input-validators/password";
import validateThirdPartyID from "../../../lib/utils/input-validators/thirdPartyID";
import expGenerator from "../../../lib/utils/web-token/expGenerator";
import encryptGrantID from "../../../lib/utils/crypto/web-token/encrypt/grantID";
import encryptThirdPartyID from "../../../lib/utils/crypto/web-token/encrypt/thirdPartyID";
import webToken from "../../../lib/utils/web-token/webToken";
import idGenerator from "../../../lib/utils/id-generator/idGenerator";
import comparePasswords from "../../../lib/utils/crypto/password/compare";

import errors from "../../../lib/errors/controller";
import errorEnums from "../../../lib/enums/error/controller";
const { DoesNotMatchError } = errors;

/*  validates the supplied emailUsername, password, and third-party ID from the req body.
 *
 *  Only throws custom errors, does not add any new data to the req object.
 */
function validateInput(req) {
  const { emailUsername, password, thirdPartyID } = req.body;

  validateEmailUsername(emailUsername);
  validatePassword(password);
  validateThirdPartyID(thirdPartyID);
}

/*  Retrieves the URI using the third-party ID from the req body.
 *
 *  If the URI does not exist, this means the third-party associated with the ID
 *  does not exist either. Throw a custom error in response
 *
 *  The URI is stored within the req object.
 *
 *  req.uri = retrieved URI.
 */
async function getURI(req) {
  const { thirdPartyID } = req.body;

  req.uri = await models.getURI(thirdPartyID);
}

/*  takes the emailUsername from the req body and uses such to fetch the corresponding
 *  user ID and hashed password via a custom model abstraction.
 *
 *  The retrieved user ID and hashed password are stored in the req object under a userData property.
 *
 *  req.userData.userID = retrieved user ID
 *  req.userData.hashedPassword = retrieved hashed password
 */
async function getUserIDandPassword(req) {
  const { emailUsername } = req.body;

  req.userData = await models.getUserIDandPassword(emailUsername);
}

/*  takes the password from the req body and compares such to the
 *  hashed password stored in req.userData using bcrypt.
 *
 *  Only throws custom errors, does not add any new data to the req object.
 */
async function comparePasswords(req) {
  const { password } = req.body,
    { hashedPassword } = req.userData;

  const match = await comparePasswords(password, hashedPassword);

  if (!match) throw new DoesNotMatchError(errorEnums.DoesNotMatchError.PASSWORD);
}

/*  takes the user ID stored in req.userData and the third-party ID in the req body
   *  to create a new record in the 'third_party_session' table using a custom model abstraction.

   *  This is achieved doing the following in order:
   *    1. Generate a grant ID using UUID
   *    2. Generate an expiry value
   *    3. Take all of these generated values, along with the user ID and 
   *       a default authorization level and create a record in the table.
   *
   *  The grant ID and expiry value will be saved into the req object, as
   *  these are important values to be added to the token to be created.
   *
   *  req.sessionData.grantID = grant ID created
   *  req.sessionData.exp = expiry value created
   *  req.sessionData.authorization = authorization level assigned
   */
async function createThirdPartySession(req) {
  const { userID } = req.userData,
    { thirdPartyID } = req.body;

  const grantID = idGenerator(),
    exp = expGenerator(),
    authorization = 1; //ADD A MECHANISM TO DEFINE THE AUTHORIZATION LEVEL LATER

  await models.createThirdPartySession(
    userID,
    thirdPartyID,
    grantID,
    authorization,
    exp
  );

  req.sessionData = { grantID, exp, authorization };
}

/*  takes the grant ID, third-party ID, and expiry value saved under req.sessionData and req.body and puts
 *  such into the payload of the token being created.
 *
 *  The token itself is created using JWT, and such is stored within the
 *  req object.
 *
 *  req.token = token just created
 */
function createToken(req) {
  const { grantID, exp } = req.sessionData,
    { thirdPartyID } = req.body;

  const encryptedGrantID = encryptGrantID(grantID),
    encryptedThirdPartyID = encryptThirdPartyID(thirdPartyID);

  req.token = webToken.sign({
    grantID: encryptedGrantID,
    thirdPartyID: encryptedThirdPartyID,
    exp,
  });
}

/*  Finally, the token created is sent to he third-party via the URI linked to the third-party ID
 */
function respond(req, res) {
  res.status("CODE GOES HERE").json({ token: req.token });
}

export default async function authenticate(req, res) {
  try {
    validateInput(req);
    await getUserIDandPassword(req);
    await comparePasswords(req);
    await getURI(req);
    await createThirdPartySession(req);
    createToken(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
