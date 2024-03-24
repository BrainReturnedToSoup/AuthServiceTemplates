import pool from "../../../data-management/postgres-pool";
import { DatabaseError, DataNotFoundError } from "../../lib/errors/model";

export default {
  getJti: async function (grantID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      await connection.query(``, [grantID]);
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

  updateJti: async function (jti) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(``, [jti]);
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
