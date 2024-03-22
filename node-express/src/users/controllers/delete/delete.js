import errorHandler from "./errorHandler";
import models from "../../models/delete";

function validateInput(req, res) {
  /*  validates the supplied user ID from the URI parameter 'id'.
   *
   *  if the supplied user ID is valid, it is saved to the req object,
   *  otherwise a custom error is thrown for invalidity.
   *
   *  req.userID = valid user ID from the 'id' param.
   */
}

async function deleteRecord(req, res) {
  /*  Takes the user ID from the req object and initiates the deletion of a
   *  user via a custom model abstraction.
   */
}

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the update is sent. This is
   *  achieved purely with response status codes corresponding to this route success.
   */
}

export default async function deleteUser(req, res) {
  try {
    validateInput(req, res);
    await deleteRecord(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
