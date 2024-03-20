import errorHandler from "./errorHandler";

function validateInput(req, res) {
  /*  validates the supplied emailUsername, password, and third-party ID from the req body.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
}

async function retrieveURI(req, res) {
  /*  Retrieves the URI using the third-party ID from the req body.
   *
   *  If the URI does not exist, this means the third-party associated with the ID
   *  does not exist either. Throw a custom error in response
   *
   *  The URI is stored within the req object.
   *
   *  req.uri = retrieved URI.
   */
}

async function getUserData(req, res) {
  /*  takes the emailUsername from the req body and uses such to fetch the corresponding
   *  user ID and hashed password via a custom model abstraction.
   *
   *  The retrieved user ID and hashed password are stored in the req object under a userData property.
   *
   *  req.userData.userID = retrieved user ID
   *  req.userData.hashedPassword = retrieved hashed password
   */
}

async function comparePasswords(req, res) {
  /*  takes the password from the req body and compares such to the
   *  hashed password stored in req.userData using bcrypt.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
}

async function createThirdPartySession(req, res) {
  /*  takes the user ID stored in req.userData and the third-party ID in the req body
   *  to create a new record in the 'third_party_session' table using a custom model abstraction.

   *  This is achieved doing the following in order:
   *    1. Generate a grant ID using UUID
   *    2. Generate an expiry value
   *    3. Take all of these generated values, along with the user ID and 
   *       a default authorization level and create a record in the table.
   *
   *  The grant ID and expiry value will be saved into the req object, as
   *  these are important values to be added to the token to be created.
   *
   *  req.sessionData.grantID = grant ID created
   *  req.sessionData.exp = expiry value created
   */
}

function createToken(req, res) {
  /*  takes the grant ID, third-party ID, and expiry value saved under req.sessionData and req.body and puts
   *  such into the payload of the token being created.
   *
   *  The token itself is created using JWT, and such is stored within the
   *  req object.
   *
   *  req.token = token just created
   */
}

function respond(req, res) {
  /*  Finally, the token created is sent to he third-party via the URI linked to the third-party ID
   */
}

export default async function authenticate(req, res) {
  try {
    validateInput(req, res);
    await getUserData(req, res);
    await comparePasswords(req, res);
    await retrieveURI(req, res);
    await createThirdPartySession(req, res);
    createToken(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
