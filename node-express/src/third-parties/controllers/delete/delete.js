import errorHandler from "./errorHandler";

function validateInput(req, res) {
  /*  validates the supplied third-party ID from the URI parameter 'id'.
   *
   *  if the supplied third-party ID is valid, it is saved to the req object,
   *  otherwise a custom error is thrown for invalidity.
   *
   *  req.thirdPartyID = valid user ID from the 'id' param.
   */
}

async function deleteThirdPartyRecord(req, res) {
  /*  Takes the third-party ID from the req object and initiates the deletion of a
   *  third-party via a custom model abstraction.
   */
}

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the deletion is sent. This is
   *  achieved purely with response status codes corresponding to this route success.
   */
}

export default async function deleteThirdParty(req, res) {
  try {
    validateInput(req, res);
    await deleteThirdPartyRecord(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
