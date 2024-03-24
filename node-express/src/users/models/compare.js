import pool from "../../../data-management/postgres-pool";
import { DatabaseError, DataNotFoundError } from "../../lib/errors/model";

export default {
  getHashedPassword: async function (userID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(``, [userID]);
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

    return result.password;
  },

  getEmailUsername: async function (userID) {
    let connection, result, error;

    try {
      connection = await pool.connect();

      result = await connection.oneOrNone(``, [userID]);
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

    return result.emailUsername;
  },
};
