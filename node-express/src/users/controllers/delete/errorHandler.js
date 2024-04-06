import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/errors/util/input-validation";
import inputValidationErrorEnums from "../../../lib/enums/error/util/input-validation";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res, error);
      break;

    case error instanceof inputValidationErrors.InputValidationError:
      handle.inputValidationError(req, res, error);
      break;

    default:
      handle.serverError(req, res, error);
  }
}

const handle = {
  databaseError: function (req, res, error) {},

  inputValidationError: function (req, res, error) {},

  serverError: function (req, res, error) {},
};
