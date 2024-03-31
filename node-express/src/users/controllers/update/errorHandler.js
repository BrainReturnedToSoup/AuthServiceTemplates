import utilErrors from "../../../lib/errors/util/input-validation";
import modelErrors from "../../../lib/errors/model";

export default {
  password: function (req, res, error) {
    switch (true) {
      case error instanceof modelErrors.DatabaseError:
        handle.password.databaseError(req, res, error);
        break;

      case error instanceof utilErrors.InputValidationError:
        handle.password.inputValidationError(req, res, error);
        break;

      default:
        handle.password.serverError(req, res, error);
    }
  },

  emailUsername: function (req, res, error) {
    switch (true) {
      case error instanceof modelErrors.DatabaseError:
        handle.emailUsername.databaseError(req, res, error);
        break;

      case error instanceof utilErrors.InputValidationError:
        handle.emailUsername.inputValidationError(req, res, error);
        break;

      default:
        handle.emailUsername.serverError(req, res, error);
    }
  },
};

const handle = {
  password: {
    databaseError: function (req, res, error) {},
    inputValidationError: function (req, res, error) {},
    serverError: function (req, res, error) {},
  },
  
  emailUsername: {
    databaseError: function (req, res, error) {},
    inputValidationError: function (req, res, error) {},
    serverError: function (req, res, error) {},
  },
};
