import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/errors/util/input-validation";
import webTokenErrors from "../../../lib/errors/util/web-token";
import responseEnums from "../../../lib/enums/response/authenticate";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof controllerErrors.DoesNotMatchError:
      handle.doesNotMatchError(req, res, error);
      break;

    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res, error);
      break;

    case error instanceof modelErrors.DataNotFoundError:
      handle.dataNotFoundError(req, res, error);
      break;

    case error instanceof inputValidationErrors.InputValidationError:
      handle.inputValidationError(req, res, error);
      break;

    case error instanceof webTokenErrors.TokenError:
      handle.tokenError(req, res, error);
      break;

    default:
      handle.serverError(req, res, error);
  }
}

const handle = {
  doesNotMatchError: function (req, res, error) {
    //forbidden
    res.status(403).json({
      message: responseEnums.doesNotMatchError,
      details: error.message,
    });
  },

  databaseError: function (req, res, error) {
    //some type of internal server error related to the DB operations
    res
      .status(500)
      .json({ message: responseEnums.databaseError, details: error.message });
  },

  dataNotFoundError: function (req, res, error) {
    //data not found (user)
    res.status(404).json({
      message: responseEnums.dataNotFoundError,
      details: error.message,
    });
  },

  inputValidationError: function (req, res, error) {
    //bad request
    res.status(400).json({
      message: responseEnums.inputValidationError,
      details: error.message,
    });
  },

  tokenError: function (req, res, error) {
    //some type of internal server error related to token APIs
    res
      .status(500)
      .json({ message: responseEnums.tokenError, details: error.message });
  },

  serverError: function (req, res, error) {
    //any unforeseen internal server error
    res
      .status(500)
      .json({ message: responseEnums.serverError, details: error.message });
  },
};
