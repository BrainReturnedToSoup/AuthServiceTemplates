import pool from "../../../data-management/postgres-pool";
import modelErrors from "../../lib/errors/model";
import modelErrorEnums from "../../lib/enums/error/model";
const { DatabaseError, DataNotFoundError } = modelErrors;

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

    if (error) throw new DatabaseError(error.message);

    if (!result)
      throw new DataNotFoundError(modelErrorEnums.DataNotFoundError.JTI);

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

    if (error) throw new DatabaseError(error.message);
  },
};
