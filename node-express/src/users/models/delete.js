import pool from "../../../data-management/postgres-pool";
import modelErrors from "../../lib/errors/model";

const { DatabaseError } = modelErrors;

export default {
  deleteUser: async function (userID) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        DELETE FROM Users
        WHERE user_id = $1
        `,
        [userID]
      );
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) throw new DatabaseError(error.message);
  },
};
