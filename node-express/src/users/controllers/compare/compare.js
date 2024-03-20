import errorHandler from "./errorHandler";
import models from "../../models/users/compare";

const password = {
  validateInput: function (req, res) {
    /*  validates the supplied user ID and password from the req body.
     *
     *  Only throws custom errors, does not add any new data to the req object.
     */
  },
  getData: async function (req, res) {
    /*  Takes the user ID from the req body, and uses such to fetch the corresponding
     *  stored hashed password via a custom model abstraction.
     *
     *  The retrieved hashed password is stored in the req object.
     *
     *  req.hashedPassword = retrieved hashed password
     */
  },
  compare: function (req, res) {
    /*  compares the password from the req body to the hashed
     *  password stored in the req object itself.
     *
     *  The result of this comparison is saved to the req object under the 'matches' property.
     *  This value is a boolean value.
     *
     *  req.matches = boolean corresponding to the comparison.
     */
  },
};

const emailUsername = {
  validateInput: function (req, res) {
    /*  validates the supplied user ID and emailUsername from the req body.
     *
     *  Only throws custom errors, does not add any new data to the req object.
     */
  },
  getData: async function (req, res) {
    /*  Takes the user ID from the req body, and uses such to fetch the corresponding
     *  stored email via a custom model abstraction.
     *
     *  The retrieved hashed password is stored in the req object.
     *
     *  req.emailUsername= retrieved emailUsername
     */
  },
  compare: function (req, res) {
    /*  compares the email from the req body to the retrieved email
     *  stored in the req object itself.
     *
     *  The result of this comparison is saved to the req object under the 'matches' property.
     *  This value is a boolean value.
     *
     *  req.matches = boolean corresponding to the comparison.
     */
  },
};

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the comparison is sent. The body
   *  of the response is a JSON that contains the single property 'matches', which derives
   *  from the 'matches' property on the req object.
   */
}

export default {
  password: async function (req, res) {
    try {
      password.validateInput(req, res);
      await password.getData(req, res);
      password.compare(req, res);
      respond(req, res);
    } catch (error) {
      errorHandler.password(req, res, error);
    }
  },
  emailUsername: async function (req, res) {
    try {
      emailUsername.validateInput(req, res);
      await emailUsername.getData(req, res);
      emailUsername.compare(req, res);
      respond(req, res);
    } catch (error) {
      errorHandler.emailUsername(req, res, error);
    }
  },
};
