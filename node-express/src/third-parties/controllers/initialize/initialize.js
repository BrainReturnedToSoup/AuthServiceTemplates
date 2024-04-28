import errorHandler from "./errorHandler";
import models from "../../models/initialize";
import validateThirdPartyName from "../../../lib/utils/input-validators/thirdPartyName";
import validateThirdPartyURI from "../../../lib/utils/input-validators/thirdPartyURI";
import idGenerator from "../../../lib/utils/id-generator/idGenerator";
import errors from "../../../lib/errors/controller";
const { ExistingRecordError } = errors;

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

/*  Takes the third party name and queries such against the DB, checking
 *  for whether an existing third party exists matching said name
 *
 *  This function only throws errors, as it does not modify the req object in any way.
 */
async function checkExistingThirdParty(req) {
  const { name } = req.body;

  const existingThirdParty = await models.checkExistingRecord(name);

  if (existingThirdParty) throw new ExistingRecordError();
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

  req.thirdPartyID = idGenerator();

  await models.createThirdParty(req.thirdPartyID, name, uri);
}

/*  Finally, a request demonstrating the success of the update is sent. This is
 *  includes the user ID generated for the specific initialization within the response body JSON.
 *
 *  res.body.id = third-party ID generated
 */
function respond(req, res) {
  //resource created
  res.status(201).json({ id: req.thirdPartyID });
}

export default async function initialize(req, res) {
  try {
    validateInput(req);
    await checkExistingThirdParty(req);
    await createThirdParty(req);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
