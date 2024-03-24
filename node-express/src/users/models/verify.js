import pool from "../../../data-management/postgres-pool";
import { DatabaseError, DataNotFoundError } from "../../lib/errors/model";

export default {
  getJti: async function (grantID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        SELECT jti
        FROM User_Sessions
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

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!result) {
      throw new DataNotFoundError();
    }

    return result.jti;
  },

  updateJti: async function (grantID, jti) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        UPDATE User_Sessions
        SET jti = $1
        WHERE grant_id = $2
      `,
        [jti, grantID]
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
