import errorHandlers from "./errorHandler";
import models from "../../models/update";
import validateEmailUsername from "../../../lib/utils/input-validators/emailUsername";
import validatePassword from "../../../lib/utils/input-validators/password";
import validateUserID from "../../../lib/utils/input-validators/userID";
import hashPassword from "../../../lib/utils/crypto/password/hash";

const password = {
  /*  validates the supplied user ID and new password
   *  from the body.
   *
   *  This function only throws custom errors in the case of invalid inputs.
   *  It does not add any new data to the req object.
   */
  validateInput: function (req) {
    const { userID, password } = req.body;

    validateUserID(userID);
    validatePassword(password);
  },

  hashNewPassword: async function (req) {
    const { password } = req.body;

    req.hashedPassword = await hashPassword(password);
  },

  /*  Takes the user ID and new password from the req body and
   *  uses such in the overwrite of the password linked to the user ID using a custom
   *  model abstraction.
   *
   *  This is achieved via a custom model abstraction for applying the update.
   */
  update: async function (req) {
    const { userID } = req.body,
      { hashedPassword } = req;

    await models.updatePassword(userID, hashedPassword);
  },
};

const emailUsername = {
  /*  validates the supplied user ID and new emailUsername
   *  from the body.
   *
   *  This function only throws custom errors in the case of invalid inputs.
   *  It does not add any new data to the req object.
   */
  validateInput: function (req) {
    const { userID, emailUsername } = req.body;

    validateUserID(userID);
    validateEmailUsername(emailUsername);
  },

  /*  Takes the user ID and new emailUsernme from the req body and
   *  uses such in the overwrite of the 'email_username' linked to the user ID using a custom
   *  model abstraction.
   *
   *  This is achieved via a custom model abstraction for applying the update.
   */
  update: async function (req) {
    const { userID, emailUsername } = req.body;

    await models.updateEmailUsername(userID, emailUsername);
  },
};

/*  Finally, a request demonstrating the success of the update is sent. This is
 *  achieved only using a response status code, not any explicit payload.
 */
function respond(res) {
  res.status(204).end();
}

export default {
  password: async function (req, res) {
    try {
      password.validateInput(req);
      await password.hashNewPassword(req);
      await password.update(req);
      respond(res);
    } catch (error) {
      errorHandlers.password(req, res, error);
    }
  },

  emailUsername: async function (req, res) {
    try {
      emailUsername.validateInput(req);
      await emailUsername.update(req);
      respond(res);
    } catch (error) {
      errorHandlers.emailUsername(req, res, error);
    }
  },
};
