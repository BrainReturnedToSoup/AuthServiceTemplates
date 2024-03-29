import errorHandler from "./errorHandler";
import models from "../../models/authenticate";

import validateEmailUsername from "../../../lib/utils/input-validators/emailUsername";
import validatePassword from "../../../lib/utils/input-validators/password";
import expGenerator from "../../../lib/utils/expGenerator";
import encryptGrantID from "../../../lib/utils/cryptography/encrypt/grantID";

import bcrypt from "bcrypt";
import { v4 as uuidGenerator } from "uuid";
import jwt from "jsonwebtoken";

import { DoesNotMatchError, enums } from "../../../lib/errors/controller";

/*  validates the supplied emailUsername and password from the req body.
 *
 *  Throws validator library errors, does not add any new data to the req object.
 */
function validateInput(req) {
  const { emailUsername, password } = req.body;

  validateEmailUsername(emailUsername);
  validatePassword(password);
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

  req.userData = await models.getUserIDandHashedPw(emailUsername);
}

/*  takes the password from the req body and compares such to the
 *  hashed password stored in req.userData using bcrypt.
 *
 *  Only throws custom errors, does not add any new data to the req object.
 */
async function comparePasswords(req) {
  const { password } = req.body,
    { hashedPassword } = req.userData;

  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) throw new DoesNotMatchError(enums.DoesNotMatchError.PASSWORD);
}

/*  takes the user ID stored in req.userData and creates a new record in the 'in_app_grant' table
 *  using a custom model abstraction
 *
 *  This is achieved doing the following in order:
 *    1. Generate a grant ID using UUID
 *    2. Generate a JTI using UUID
 *    3. Generate an expiry value
 *    4. Take all of these generated values, along with the user ID, and create a record in the table.
 *
 *  The grant ID, JTI, and expiry value will be saved into the req object, as
 *  these are important values to be added to the token to be created.
 *
 *  req.sessionData.grantID = grant ID created
 *  req.sessionData.jti = JTI created
 *  req.sessionData.exp = expiry value created
 */
async function createUserSession(req) {
  const { userID } = req.userData;

  const grantID = uuidGenerator(),
    jti = uuidGenerator(),
    exp = expGenerator();

  req.sessionData = await models.createSessionRecord(userID, grantID, jti, exp);
}

/*  takes the grant ID, JTI, and expiry value saved under req.sessionData and puts
 *  such into the payload of the token being created.
 *
 *  The token itself is created using JWT, and such is stored within the
 *  req object.
 *
 *  req.token = token just created
 */
function createToken(req) {
  const payload = {
    ...req.sessionData,
    grantID: encryptGrantID(req.sessionData.grantID),
  };

  req.token = jwt.sign(payload, "PRIVATE KEY HERE");
}

/*  Finally, the token created is retrieved from the req object, and supplied
 *  to the body of the response as a property 'token' within JSON. The corresponding
 *  response status is also sent based on this success.
 */
function respond(req, res) {
  res.status("CODE GOES HERE").json({ token: req.token });
}

export default async function authenticate(req, res) {
  try {
    validateInput(req);
    await getUserIDandPassword(req);
    await comparePasswords(req);
    await createUserSession(req);
    createToken(req);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
