import pool from "../../../data-management/postgres-pool";
import {
  DatabaseError,
  DataNotFoundError,
  enums,
} from "../../lib/errors/model";

export default {
  getURI: async function (thirdPartyID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT uri
        FROM Third_Parties
        WHERE third_party_id = $1
        `,
        [thirdPartyID]
      );
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) throw new DatabaseError(error.message);

    if (!result) throw new DataNotFoundError(enums.DataNotFoundError.URI);

    return result.uri;
  },

  getUserIDandPassword: async function (emailUsername) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(
        `
        SELECT user_id, pw
        FROM Users
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

    if (error) throw new DatabaseError(error.message);

    if (!result)
      throw new DataNotFoundError(enums.DataNotFoundError.USER_ID_HASHED_PW);

    return { userID: result.user_id, hashedPassword: result.pw };
  },

  createThirdPartySession: async function (
    userID,
    thirdPartyID,
    grantID,
    authorization,
    exp
  ) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `INSERT INTO Third_Party_Sessions 
          ( 
            user_id,
            grant_id,
            third_party_id,
            authorization,
            exp
          )
         SET user_id = $1,
          grant_id = $2,
          third_party_id = $3,
          authorization = $4,
          exp = $5 `,
        [userID, grantID, thirdPartyID, authorization, exp]
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
