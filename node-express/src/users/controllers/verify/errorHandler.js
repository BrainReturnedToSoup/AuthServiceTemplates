import utilErrors from "../../../lib/errors/util/web-token";
import modelErrors from "../../../lib/errors/model";
import controllerErrors from "../../../lib/errors/controller";

export default function errorHandler(req, res, error) {
  switch (true) {
    case error instanceof controllerErrors.DoesNotMatchError:
      handle.doesNotMatchError(req, res, error);
      break;

    case error instanceof utilErrors.TokenError:
      handle.tokenError(req, res, error);
      break;

    case error instanceof modelErrors.DatabaseError:
      handle.databaseError(req, res, error);
      break;

    case error instanceof modelErrors.DataNotFoundError:
      handle.dataNotFoundError(req, res, error);
      break;

    default:
      handle.serverError(req, res, error);
  }
}

const handle = {
  doesNotMatchError: function (req, res, error) {},
  tokenError: function (req, res, error) {},
  databaseError: function (req, res, error) {},
  dataNotFoundError: function (req, res, error) {},
  serverError: function (req, res, error) {},
};
