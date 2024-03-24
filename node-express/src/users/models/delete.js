import pool from "../../../data-management/postgres-pool";
import { DatabaseError } from "../../lib/errors/model";

export default {
  deleteUser: async function (userID) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(``, [userID]);
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) {
      throw new DatabaseError(error.message);
    }
  },
};
