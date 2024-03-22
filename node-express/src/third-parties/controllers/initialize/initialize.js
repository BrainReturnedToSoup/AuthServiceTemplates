import errorHandler from "./errorHandler";
import models from "../../models/initialize"

function validateInput(req, res) {
  /*  validates the supplied third-party name and URI
   *  from the body.
   *
   *  This function only throws custom errors in the case of invalid inputs.
   *  It does not add any new data to the req object.
   */
}

async function createThirdParty(req, res) {
  /*  takes the third-party name and URI from the body to create a new third-party record in the 'third-party' table
   *  using a custom model abstraction.
   *
   *  Includes the generation of a third-party ID using a UUID library.
   *  The third-party name, generated ID, and URI are saved into a single record.
   *
   *  After the record is created, the user ID originally generated is saved into the req object.
   *
   *  req.thirdPartyID = the third-party ID that was just created.
   */
}

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the update is sent. This is
   *  includes the user ID generated for the specific initialization within the response body JSON.
   *
   *  res.body.thirdPartyID = third-party ID generated
   */
}

export default async function initialize(req, res) {
  try {
    validateInput(req, res);
    await createThirdParty(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
