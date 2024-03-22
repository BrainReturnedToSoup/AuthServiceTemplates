import pool from "../../../data-management/postgres-pool";

export default {
  retrieveURI: async function (thirdPartyID) {
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

  getUserRecord: async function (emailUsername) {
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

  createThirdPartySession: async function (
    userID,
    thirdPartyID,
    grantID,
    authorization,
    exp
  ) {
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

    //do not return anything, errors reflect the lack of success
  },
};
