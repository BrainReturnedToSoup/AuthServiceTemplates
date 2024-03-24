import errorHandler from "./errorHandler";
import models from "../../models/compare";

import validateEmailUsername from "../../../lib/utils/input-validators/emailUsername";
import validatePassword from "../../../lib/utils/input-validators/password";
import validateUserID from "../../../lib/utils/input-validators/userID";

import bcrypt from "bcrypt";

import { DoesNotMatch } from "../../../lib/errors/controller";

const password = {
  /*  validates the supplied user ID and password from the req body.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
  validateInput: function (req) {
    const { password, userID } = req.body;

    validateUserID(userID);
    validatePassword(password);
  },

  /*  Takes the user ID from the req body, and uses such to fetch the corresponding
   *  stored hashed password via a custom model abstraction.
   *
   *  The retrieved hashed password is stored in the req object.
   *
   *  req.hashedPassword = retrieved hashed password
   */
  getData: async function (req) {
    const { userID } = req.body;

    req.hashedPassword = await models.getHashedPassword(userID);
  },

  /*  compares the password from the req body to the hashed
   *  password stored in the req object itself.
   *
   *  The result of this comparison is saved to the req object under the 'matches' property.
   *  This value is a boolean value.
   *
   *  req.matches = boolean corresponding to the comparison.
   */
  compare: async function (req) {
    const { password } = req.body,
      { hashedPassword } = req;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) throw new DoesNotMatch();
  },
};

const emailUsername = {
  /*  validates the supplied user ID and emailUsername from the req body.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
  validateInput: function (req) {
    const { emailUsername, userID } = req.body;

    validateUserID(userID);
    validateEmailUsername(emailUsername);
  },

  /*  Takes the user ID from the req body, and uses such to fetch the corresponding
   *  stored email via a custom model abstraction.
   *
   *  The retrieved hashed password is stored in the req object.
   *
   *  req.emailUsername= retrieved emailUsername
   */
  getData: async function (req) {
    const { userID } = req.body;

    req.emailUsername = await models.getEmailUsername(userID);
  },

  /*  compares the email from the req body to the retrieved email
   *  stored in the req object itself.
   *
   *  The result of this comparison is saved to the req object under the 'matches' property.
   *  This value is a boolean value.
   *
   *  req.matches = boolean corresponding to the comparison.
   */
  compare: function (req) {
    if (req.emailUsername !== req.body.emailUsername) throw new DoesNotMatch();
  },
};

/*  Finally, a request demonstrating the success of the comparison is sent. The body
 *  of the response is a JSON that contains the single property 'matches', which derives
 *  from the 'matches' property on the req object.
 */
function respond(res) {
  res.status("CODE GOES HERE").json({ matches: true });
}

export default {
  password: async function (req, res) {
    try {
      password.validateInput(req);
      await password.getData(req);
      password.compare(req);
      respond(res);
    } catch (error) {
      errorHandler.password(req, res, error);
    }
  },

  emailUsername: async function (req, res) {
    try {
      emailUsername.validateInput(req);
      await emailUsername.getData(req);
      emailUsername.compare(req);
      respond(req, res);
    } catch (error) {
      errorHandler.emailUsername(req, res, error);
    }
  },
};
