import controllerErrors from "../../../lib/errors/controller";
import modelErrors from "../../../lib/errors/model";

export default function errorHandler(req, res, error) {
  switch (true) {
    case typeof error === controllerErrors.DoesNotMatchError:
      handle.doesNotMatchError(req, res);
      break;

    case typeof error === modelErrors.DatabaseError:
      handle.databaseError(req, res);
      break;

    case typeof error === modelErrors.DataNotFoundError:
      handle.dataNotFoundError(req, res);
      break;

    default:
      handle.serverError(req, res);
  }
}

const handle = {
  doesNotMatchError: function (req, res) {},
  databaseError: function (req, res) {},
  dataNotFoundError: function (req, res) {},
  serverError: function (req, res) {},
};
