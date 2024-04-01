import utilErrors from "../../../lib/errors/util/input-validation";
import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof utilErrors.InputValidationError:
      handle.inputValidationError(req, res, error);
      break;

    case error instanceof controllerErrors.ExistingRecordError:
      handle.existingRecordError(req, res, error);
      break;

    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res, error);
      break;

    default:
      handle.serverError(req, res, error);
  }
}

const handle = {
  inputValidationError: function (req, res, error) {},
  existingRecordError: function (req, res, error) {},
  databaseError: function (req, res, error) {},
  serverError: function (req, res, error) {},
};
