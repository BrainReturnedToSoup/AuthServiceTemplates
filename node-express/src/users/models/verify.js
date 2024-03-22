import pool from "../../../data-management/postgres-pool";

export default {
  getSessionRecord: function (grantID) {
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
  updateJti: function (jti) {
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

    //does not return anything, the absence of an error means the update went through.
  },
};
