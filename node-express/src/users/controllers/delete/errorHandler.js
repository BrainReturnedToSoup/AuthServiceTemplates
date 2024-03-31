import utilErrors from "../../../lib/errors/util/input-validation";
import modelErrors from "../../../lib/errors/model";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof modelErrors.DatabaseError:
      break;

    case error instanceof utilErrors.InputValidationError:
      break;

    default:
  }
}

const handle = {
  databaseError: function (req, res, error) {},
  inputValidationError: function (req, res, error) {},
};
