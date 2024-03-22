import pool from "../../../data-management/postgres-pool";

export default {
  updatePassword: async function (userID, newPassword) {
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
  updateEmailUsername: async function (userID, newEmailUsername) {
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
