import errorHandler from "./errorHandler";
import models from "../../models/users/update";

const password = {
  validateInput: function (req, res) {
    /*  validates the supplied user ID and new password
     *  from the body.
     *
     *  This function only throws custom errors in the case of invalid inputs.
     *  It does not add any new data to the req object.
     */
  },
  update: async function (req, res) {
    /*  Takes the user ID and new password from the req body and
     *  uses such in the overwrite of the password linked to the user ID using a custom
     *  model abstraction.
     *
     *  This is achieved via a custom model abstraction for applying the update.
     */
  },
};

const emailUsername = {
  validateInput: function (req, res) {
    /*  validates the supplied user ID and new emailUsername
     *  from the body.
     *
     *  This function only throws custom errors in the case of invalid inputs.
     *  It does not add any new data to the req object.
     */
  },
  update: async function (req, res) {
    /*  Takes the user ID and new emailUsernme from the req body and
     *  uses such in the overwrite of the 'email_username' linked to the user ID using a custom
     *  model abstraction.
     *
     *  This is achieved via a custom model abstraction for applying the update.
     */
  },
};

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the update is sent. This is
   *  achieved only using a response status code, not any explicit payload.
   */
}

export default {
  password: async function (req, res) {
    try {
      password.validateInput(req, res);
      await password.update(req, res);
      respond(req, res);
    } catch (error) {
      errorHandler.password(req, res, error);
    }
  },
  emailUsername: async function (req, res) {
    try {
      emailUsername.validateInput(req, res);
      await emailUsername.update(req, res);
      respond(req, res);
    } catch (error) {
      errorHandler.emailUsername(req, res, error);
    }
  },
};
