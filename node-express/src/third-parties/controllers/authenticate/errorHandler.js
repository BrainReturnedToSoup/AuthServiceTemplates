import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/enums/errors/util/input-validation";
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

    case error instanceof modelErrors.DataNotFoundError:
      handle.dataNotFoundError(res, error);
      break;

    case error instanceof controllerErrors.DoesNotMatchError:
      handle.doesNotMatchError(res, error);
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

  dataNotFoundError: function (res, error) {
    //data not found (third-party or user)
    errorResponse(res, 404, responseEnums.dataNotFoundError, error.message);
  },

  doesNotMatchError: function (res, error) {
    //forbidden
    errorResponse(res, 403, responseEnums.doesNotMatchError, error.message);
  },

  serverError: function (res, error) {
    //any unforeseen internal server error
    errorResponse(res, 500, responseEnums.serverError, error.message);
  },
};
