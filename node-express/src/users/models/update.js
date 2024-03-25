import pool from "../../../data-management/postgres-pool";
import { DatabaseError } from "../../lib/errors/model";

export default {
  updatePassword: async function (userID, newPassword) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        UPDATE Users
        SET pw = $1
        WHERE user_id = $2
        `,
        [newPassword, userID]
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

  updateEmailUsername: async function (userID, newEmailUsername) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        UPDATE Users
        SET email_username = $1
        WHERE user_id = $2
        `,
        [newEmailUsername, userID]
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
