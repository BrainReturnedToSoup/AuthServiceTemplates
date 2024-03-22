import errorHandler from "./errorHandler";

function validateInput(req, res) {
  /*  validates the supplied token in the req body to ensure the token is a JWT token,
   *  not expired, nor tampered with.
   *
   *  This function should put the decoded token into the
   *  req object if the token is valid on the surface.
   *
   *  req.decodedToken = decoded token
   */
}

async function decryptTokenPayload(req, res) {
  /*  Takes the decoded token from req.decodedToken and decrypts the corresponding
   *  Data within it. This includes the encrypted grant ID and third-party ID.
   *
   *  Additionally, all of decrypted and already interpretable information from the token
   *  is wrapped in an object as saved into the req object.
   *
   *  req.tokenData = token data object
   */
}

async function getRecord(req, res) {
  /*  The third-party grant record associated with the token is fetched using the grant ID with a custom model abstraction.
   *  This includes the relevant data, such as the grant ID and third-party ID for that specific grant session.
   *
   *  The retrieved third-party ID is stored in the req object under the thirdPartyID
   *
   *  req.thirdPartyID = retrieved third-party ID
   */
}

function compareThirdPartyID(req, res) {
  /*  takes the third-party ID from the req body and compares such to the
   *  retrieved third-party ID from the req object.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
}

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the deletion is sent. This is
   *  achieved purely with response status codes corresponding to this route success.
   */
}

export default async function verify(req, res) {
  try {
    validateInput(req, res);
    await decryptTokenPayload(req, res);
    await getRecord(req, res);
    compareThirdPartyID(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
