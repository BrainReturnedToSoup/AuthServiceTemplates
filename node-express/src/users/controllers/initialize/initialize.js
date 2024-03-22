import errorHandler from "./errorHandler";
import models from "../../models/initialize";

import validateEmailUsername from "../../../lib/utils/input-validators/emailUsername";
import validatePassword from "../../../lib/utils/input-validators/password";

import { v4 as uuidGenerator } from "uuid";
import bcrypt from "bcrypt";

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

  const userID = uuidGenerator();
  const hashedPassword = await bcrypt.hash(password, "ADD SALT ROUNDS HERE");

  await models.createUser(userID, emailUsername, hashedPassword);

  req.userID = userID;
}

/*  Finally, a request demonstrating the success of the update is sent. This is
 *  includes the user ID generated for the specific initialization within the response body JSON.
 *
 *  res.body.userID = user ID generated
 */
function respond(req, res) {
  res.status("CODE GOES HERE").json({ userID: req.userID });
}

export default async function initialize(req, res) {
  try {
    validateInput(req);
    await createUser(req);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
