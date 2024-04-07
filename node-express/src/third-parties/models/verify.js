import pool from "../../../data-management/postgres-pool";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DatabaseError, DataNotFoundError } = errors;

export default {
  getSessionIDs: async function (grantID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT user_id, third_party_id
        FROM Third_Party_Sessions
        WHERE grant_id = $1
        `,
        [grantID]
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
        errorEnums.DataNotFoundError.USER_ID_THIRD_PARTY_ID
      );

    return { userID: result.user_id, thirdPartyID: result.third_party_id };
  },

  verifyUserID: async function (userID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT user_id
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

    if (!result) throw new DataNotFoundError(errorEnums.DataNotFoundError.USER_ID);
  },
};
