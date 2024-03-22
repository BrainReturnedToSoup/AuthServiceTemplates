import errorHandler from "./errorHandler";
import models from "../../models/delete";

import validateUserID from "../../../lib/utils/input-validators/userID";

/*  validates the supplied user ID from the route parameter 'id'.
 *
 *  if the supplied user ID is valid, it is saved to the req object,
 *  otherwise a custom error is thrown for invalidity.
 *
 *  req.userID = valid user ID from the 'id' param.
 */
function validateInput(req) {
  const { id } = req.params;

  validateUserID(id);
}

/*  Takes the user ID from the req object and initiates the deletion of a
 *  user via a custom model abstraction.
 */
async function deleteRecord(req) {
  const { id } = req.params;

  await models.deleteUser(id);
}

/*  Finally, a request demonstrating the success of the update is sent. This is
 *  achieved purely with response status codes corresponding to this route success.
 */
function respond(res) {
  res.status("CODE GOES HERE");
}

export default async function deleteUser(req, res) {
  try {
    validateInput(req);
    await deleteRecord(req);
    respond(res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
