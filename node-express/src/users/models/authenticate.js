import pool from "../../../data-management/postgres-pool";
import { DatabaseError, DataNotFoundError } from "../../lib/errors/model";

export default {
  getUserIDandHashedPw: async function (emailUsername) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT user_id, pw
        FROM users
        WHERE email_username = $1
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

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!result) {
      throw new DataNotFoundError();
    }

    return { userID: result.user_id, hashedPassword: result.pw };
  },

  createSessionRecord: async function (userID, grantID, jti, exp) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        INSERT INTO User_Sessions (grant_id, user_id, jti, expiration)
        VALUES ($1, $2, $3, $4)
      `,
        [userID, grantID, jti, exp]
      );
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
