import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/enums/errors/util/input-validation";
import responseEnums from "../../../lib/enums/response/response";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof inputValidationErrors.InputValidationError:
      handle.inputValidationError(req, res, error);
      break;

    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res, error);
      break;

    case error instanceof modelErrors.DataNotFoundError:
      handle.dataNotFoundError(req, res, error);
      break;

    case error instanceof controllerErrors.DoesNotMatchError:
      handle.doesNotMatchError(req, res, error);
      break;

    default:
      handle.serverError(req, res, error);
  }
}

const handle = {
  inputValidationError: function (req, res, error) {
    //bad request
    res.status(400).json({ message: responseEn})
  },

  databaseError: function (req, res, error) {},

  dataNotFoundError: function (req, res, error) {},

  doesNotMatchError: function (req, res, error) {},

  serverError: function (req, res, error) {},
};
