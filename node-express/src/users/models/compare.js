import pool from "../../../data-management/postgres-pool";
import modelErrors from "../../lib/errors/model";
import modelErrorEnums from "../../lib/enums/error/model";
const { DatabaseError, DataNotFoundError } = modelErrors;

export default {
  getHashedPassword: async function (userID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT pw
        FROM Users
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

    if (!result)
      throw new DataNotFoundError(modelErrorEnums.DataNotFoundError.HASHED_PW);

    return result.pw;
  },

  getEmailUsername: async function (userID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT email_username
        FROM Users
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

    if (!result)
      throw new DataNotFoundError(
        modelErrorEnums.DataNotFoundError.EMAIL_USERNAME
      );

    return result.emailUsername;
  },
};
