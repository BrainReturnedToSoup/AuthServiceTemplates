import errorResponse from "./errorHandler";
import models from "../../models/initialize";
import validateEmailUsername from "../../../lib/utils/input-validators/emailUsername";
import validatePassword from "../../../lib/utils/input-validators/password";
import idGenerator from "../../../lib/utils/id-generator/idGenerator";
import hashPassword from "../../../lib/utils/crypto/password/hash";
import errors from "../../../lib/errors/controller";
const { ExistingRecordError } = errors;

/*  validates the supplied emailUsername and password
 *  from the body.
 *
 *  This function only throws custom errors in the case of invalid inputs.
 *  It does not add any new data to the req object.
 */
function validateInput(req) {
  const { emailUsername, password } = req.body;

  validateEmailUsername(emailUsername);
  validatePassword(password);
}

/*  Takes the emailUsername and queries such against the DB, checking
 *  for whether an existing user exists matching said emailUsername
 *
 *  This function only throws errors, as it does not modify the req object in any way.
 */
async function checkExistingUser(req) {
  const { emailUsername } = req.body;

  const existingUser = await models.checkExistingUser(emailUsername);

  if (existingUser) throw new ExistingRecordError();
}

/*  takes the emailUsername and password from the body to create a new user record in the 'users' table
 *  using a custom model abstraction.
 *
 *  Includes the generation of a user ID using a UUID library.
 *  The password is hashed using Bcrypt, which the hashed instance is what is saved
 *  into the password column of the table.
 *
 *  After the record is created, the user ID originally generated is saved into the req object.
 *
 *  req.userID = the user ID that was just created.
 */
async function createUser(req) {
  const { emailUsername, password } = req.body;

  const hashedPassword = await hashPassword(password);

  req.userID = idGenerator();

  await models.createUser(req.userID, emailUsername, hashedPassword);
}

/*  Finally, a request demonstrating the success of the update is sent. This is
 *  includes the user ID generated for the specific initialization within the response body JSON.
 *
 *  res.body.userID = user ID generated
 */
function respond(req, res) {
  res.status(201).json({ userID: req.userID });
}

export default async function initialize(req, res) {
  try {
    validateInput(req);
    await checkExistingUser(req);
    await createUser(req);
    respond(req, res);
  } catch (error) {
    errorResponse(req, res, error);
  }
}
