import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";
import inputValidationErrors from "../../../lib/errors/util/input-validation";
import webTokenErrors from "../../../lib/errors/util/web-token";
import webTokenErrorEnums from "../../../lib/enums/error/util/web-token";

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
    res.status(403).send("INVALID-CREDENTIALS");
  },

  databaseError: function (req, res, error) {
    //some type of internal server error related to the DB operations
    res.status(500).send("DATABASE-ERROR:UNKNOWN");
  },

  dataNotFoundError: function (req, res, error) {
    //data not found (user)
    res.status(404).send("DATA-NOT-FOUND:USER");
  },

  inputValidationError: function (req, res, error) {
    //not acceptable
    res.status(406).send("INPUT-VALIDATION");
  },

  tokenError: function (req, res, error) {
    if (error.message == webTokenErrorEnums.NOT_BEFORE) {
      //forbidden
      res.status(403).send("TOKEN-ERROR:NOT-BEFORE");
    } else {
      //some type of internal server error related to tokens
      res.status(500).send("TOKEN-ERROR:UNKNOWN");
    }
  },

  serverError: function (req, res, error) {
    //internal server error
    res.status(500).send("SERVER-ERROR:UNKNOWN");
  },
};
