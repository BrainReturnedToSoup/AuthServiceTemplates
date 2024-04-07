import pool from "../../../data-management/postgres-pool";
import errors from "../../lib/errors/model";
const { DatabaseError } = errors;

export default {
  checkExistingUser: async function (emailUsername) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT emailUsername
        FROM users
        WHERE emailUsername = $1
        `,
        [emailUsername]
      );
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) throw new DatabaseError(error.message);

    return result !== null;
  },

  createUser: async function (userID, emailUsername, hashedPassword) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        INSERT INTO Users (user_id, email_username, pw)
        VALUES ($1, $2, $3)
        `,
        [userID, emailUsername, hashedPassword]
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
