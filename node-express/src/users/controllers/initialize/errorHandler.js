import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/errors/util/input-validation";
import responseEnums from "../../../lib/enums/response/response";
import errorResponse from "../../../lib/utils/response/errorResponse";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(res, error);
      break;

    case error instanceof controllerErrors.ExistingRecordError:
      handle.existingRecordError(res, error);
      break;

    case error instanceof inputValidationErrors.InputValidationError:
      handle.inputValidationError(res, error);
      break;

    default:
      handle.serverError(res, error);
  }
}

const handle = {
  databaseError: function (res, error) {
    //some type of internal server error related to the DB operations
    errorHandler(res, 500, responseEnums.databaseError, error.message);
  },

  existingRecordError: function (res, error) {
    //conflict due to existing record (user) linked to supplied information
    errorHandler(res, 409, responseEnums.existingRecordError, error.message);
  },

  inputValidationError: function (res, error) {
    //bad request
    errorHandler(res, 400, responseEnums.inputValidationError, error.message);
  },

  serverError: function (res, error) {
    //any unforeseen internal server error
    errorHandler(res, 500, responseEnums.serverError, error.message);
  },
};
