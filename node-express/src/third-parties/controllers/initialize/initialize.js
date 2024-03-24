import errorHandler from "./errorHandler";
import models from "../../models/initialize";

import validateThirdPartyName from "../../../lib/utils/input-validators/thirdPartyName";
import validateThirdPartyURI from "../../../lib/utils/input-validators/thirdPartyURI";

import { v4 as uuidGenerator } from "uuid";

/*  validates the supplied third-party name and URI
 *  from the body.
 *
 *  This function only throws custom errors in the case of invalid inputs.
 *  It does not add any new data to the req object.
 */
function validateInput(req) {
  const { name, uri } = req.body;

  validateThirdPartyName(name);
  validateThirdPartyURI(uri);
}

/*  takes the third-party name and URI from the body to create a new third-party record in the 'third-party' table
 *  using a custom model abstraction.
 *
 *  Includes the generation of a third-party ID using a UUID library.
 *  The third-party name, generated ID, and URI are saved into a single record.
 *
 *  After the record is created, the third-party ID originally generated is saved into the req object.
 *
 *  req.thirdPartyID = the third-party ID that was just created.
 */
async function createThirdParty(req) {
  const { name, uri } = req.body;

  req.thirdPartyID = uuidGenerator();

  await models.createThirdParty(req.thirdPartyID, name, uri);
}

/*  Finally, a request demonstrating the success of the update is sent. This is
 *  includes the user ID generated for the specific initialization within the response body JSON.
 *
 *  res.body.id = third-party ID generated
 */
function respond(req, res) {
  res.status("ADD CODE HERE").json({ id: req.thirdPartyID });
}

export default async function initialize(req, res) {
  try {
    validateInput(req);
    await createThirdParty(req);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
