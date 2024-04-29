import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/errors/util/input-validation";
import responseEnums from "../../../lib/enums/response/response";
import errorResponse from "../../../lib/utils/response/errorResponse";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof inputValidationErrors.InputValidationError:
      handle.inputValidationError(res, error);
      break;

    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(res, error);
      break;

    case error instanceof modelErrors.ExistingRecordError:
      handle.existingRecordError(res, error);
      break;

    default:
      handle.serverError(res, error);
  }
}

const handle = {
  inputValidationError: function (res, error) {
    //bad request
    errorResponse(res, 400, responseEnums.inputValidationError, error.message);
  },

  databaseError: function (res, error) {
    //some type of internal server error related to the DB operations
    errorResponse(res, 500, responseEnums.databaseError, error.message);
  },

  existingRecordError: function (res, error) {
    //conflict due to existing record (third-party) linked to supplied information
    errorResponse(res, 409, responseEnums.existingRecordError, error.message);
  },

  serverError: function (req, res, error) {
    //any unforeseen internal server error
    errorResponse(res, 500, responseEnums.serverError, error.message);
  },
};
