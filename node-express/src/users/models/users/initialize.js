import pool from "../../../../data-management/postgres-pool";

export default {
  createUser: async function (userID, emailUsername, hashedPassword) {
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

    //does not return anything, the absence of an error means the creation went through.
  },
};
