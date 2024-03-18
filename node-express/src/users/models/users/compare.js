import pool from "../../../../data-management/postgres-pool";

export default {
  getHashedPassword: async function (userID) {
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

    //return the hashed password by itself
  },
  getEmailUsername: async function (userID) {
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

    //return the emailUsername by itself
  },
};
