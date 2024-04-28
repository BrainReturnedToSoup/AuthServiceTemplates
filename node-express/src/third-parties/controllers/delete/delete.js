import errorHandler from "./errorHandler";
import models from "../../models/delete";
import validateThirdPartyID from "../../../lib/utils/input-validators/thirdPartyID";

/*  validates the supplied third-party ID from the URI parameter 'id'.
 *
 *  if the supplied third-party ID is valid, it is saved to the req object,
 *  otherwise a custom error is thrown for invalidity.
 *
 *  req.thirdPartyID = valid user ID from the 'id' param.
 */
function validateInput(req) {
  const { id } = req.params;

  validateThirdPartyID(id);
}

/*  Takes the third-party ID from the req object and initiates the deletion of a
 *  third-party via a custom model abstraction.
 */
async function deleteRecord(req) {
  const { id } = req.params;

  await models.deleteRecord(id);
}

/*  Finally, a request demonstrating the success of the deletion is sent. This is
 *  achieved purely with response status codes corresponding to this route success.
 */
function respond(res) {
  //successful but no body content
  res.status(204).end();
}

export default async function deleteThirdParty(req, res) {
  try {
    validateInput(req);
    await deleteRecord(req);
    respond(res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
