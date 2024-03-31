import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import utilErrors from "../../../lib/errors/util/input-validation";
import webTokenErrors from "../../../lib/errors/util/web-token";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof controllerErrors.DoesNotMatchError:
      handle.doesNotMatchError(req, res);
      break;

    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res);
      break;

    case error instanceof modelErrors.DataNotFoundError:
      handle.dataNotFoundError(req, res);
      break;

    case error instanceof utilErrors.InputValidationError:
      handle.inputValidationError(req, res);
      break;

    case error instanceof webTokenErrors.TokenError:
      handle.tokenError(req, res);
      break;

    default:
      handle.serverError(req, res);
  }
}

const handle = {
  doesNotMatchError: function (req, res) {},
  databaseError: function (req, res) {},
  dataNotFoundError: function (req, res) {},
  inputValidationError: function (req, res) {},
  tokenError: function (req, res) {},
  serverError: function (req, res) {},
};
