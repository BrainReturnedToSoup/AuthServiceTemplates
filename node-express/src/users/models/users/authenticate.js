import pool from "../../../../data-management/postgres-pool";

export default {
  getUserIDandHashedPassword: async function (emailUsername) {
    let connection, result, error;

    try {
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        connection.done();
      }
    }

    if (error) {
      //throw a custom DB error instead of using the raw error
    }

    //return a custom object that maps the query result to such with different properties,
    //as opposed to returning the query result itself.
  },
  createSession: async function (userID, grantID, jti, exp) {
    let connection, result, error;

    try {
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        connection.done();
      }
    }

    if (error) {
      //throw a custom DB error instead of using the raw error
    }

    //does not return anything, the absence of an error means the delete went through.
  },
};
