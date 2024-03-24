import pool from "../../../data-management/postgres-pool";
import { DatabaseError, DataNotFoundError } from "../../lib/errors/model";

export default {
  getUserIDandHashedPw: async function (emailUsername) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(``, [emailUsername]);
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

    return { userID: result.user_id, hashedPassword: result.password };
  },

  createSessionRecord: async function (userID, grantID, jti, exp) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(``, [userID, grantID, jti, exp]);
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
