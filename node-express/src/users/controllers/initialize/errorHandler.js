import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/errors/util/input-validation";
import responseEnums from "../../../lib/enums/response/authenticate";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res, error);
      break;

    case error instanceof controllerErrors.ExistingRecordError:
      handle.existingRecordError(req, res, error);
      break;

    case error instanceof inputValidationErrors.InputValidationError:
      handle.inputValidationError(req, res, error);
      break;

    default:
      handle.serverError(req, res, error);
  }
}

const handle = {
  databaseError: function (req, res, error) {
    //some type of internal server error related to the DB operations
    res
      .status(500)
      .json({ message: responseEnums.databaseError, details: error.message });
  },

  existingRecordError: function (req, res, error) {
    //conflict due to existing record (user) linked to supplied information
    res
      .status(409)
      .json({ message: responseEnums.existingRecord, details: error.message });
  },

  inputValidationError: function (req, res, error) {
    //bad request
    res.status(400).json({
      message: responseEnums.inputValidationError,
      details: error.message,
    });
  },

  serverError: function (req, res, error) {
    //any unforeseen internal server error
    res
      .status(500)
      .json({ message: responseEnums.serverError, details: error.message });
  },
};
