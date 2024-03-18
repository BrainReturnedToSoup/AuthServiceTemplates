import errorHandler from "./errorHandler";

function validateInput(req, res) {
  /*  validates the supplied emailUsername and password
   *  from the body.
   *
   *  This function only throws custom errors in the case of invalid inputs.
   *  It does not add any new data to the req object.
   */
}

async function createUser(req, res) {
  /*  takes the emailUsername and password from the body to create a new user record in the 'users' table
   *  using a custom model abstraction.
   *
   *  Includes the generation of a user ID using a UUID library.
   *  The password is hashed using Bcrypt, which the hashed instance is what is saved
   *  into the password column of the table.
   *
   *  After the record is created, the user ID originally generated is saved into the req object.
   *
   *  req.userID = the user ID that was just created.
   */
}

function respond(req, res) {
  /*  Finally, a request demonstrating the success of the update is sent. This is
   *  includes the user ID generated for the specific initialization within the response body JSON.
   *
   *  res.body.userID = user ID generated
   */
}

export default async function initialize(req, res) {
  try {
    validateInput(req, res);
    await createUser(req, res);
    respond(req, res);
  } catch (error) {
    errorHandler(req, res, error);
  }
}
