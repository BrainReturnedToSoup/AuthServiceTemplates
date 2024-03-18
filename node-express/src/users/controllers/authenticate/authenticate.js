import errorHandler from "./errorHandler";

function validateInput(req, res) {
  /*  validates the supplied emailUsername and password from the req body.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
}

async function getData(req, res) {
  /*  takes the emailUsername from the req body and uses such to fetch the corresponding
   *  user ID and hashed password via a custom model abstraction.
   *
   *  The retrieved user ID and hashed password are stored in the req object under a userData property.
   *
   *  req.userData.userID = retrieved user ID
   *  req.userData.hashedPassword = retrieved hashed password
   */
}

async function compare(req, res) {
  /*  takes the password from the req body and compares such to the
   *  hashed password stored in req.userData using bcrypt.
   *
   *  Only throws custom errors, does not add any new data to the req object.
   */
}

async function createNewSession(req, res) {
  /*  takes the user ID stored in req.userData and creates a new record in the 'in_app_grant' table.

   *  This is achieved doing the following in order:
   *    1. Generate a grant ID using UUID
   *    2. Generate a JTI using UUID
   *    3. Generate an expiry value
   *    4. Take all of these generated values, along with the user ID, and create a record in the table.
   * 
   *  The grant ID, JTI, and expiry value will be saved into the req object, as
   *  these are important values to be added to the token to be created.
   *  
   *  req.sessionData.grantID = grant ID created
   *  req.sessionData.jti = JTI created
   *  req.sessionData.exp = expiry value created
   */
}

function createToken(req, res) {
  /*  takes the grant ID, JTI, and expiry value saved under req.sessionData and puts
   *  such into the payload of the token being created.
   *
   *  The token itself is created using JWT, and such is stored within the
   *  req object.
   *
   *  req.token = token just created
   */
}

function respond(req, res) {
  /*  Finally, the token created is retrieved from the req object, and supplied
   *  to the body of the response as a property 'token' within JSON. The corresponding
   *  response status is also sent based on this success.
   */
}

export default async function authenticate(req, res) {
  try {
    validateInput(req, res);
    await getData(req, res);
    await compare(req, res);
    await createNewSession(req, res);
    createToken(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
