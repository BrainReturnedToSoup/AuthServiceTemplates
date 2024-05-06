import pool from "../../../../data-management/postgres-pool";
import errors from "../../errors/model";
const { DatabaseError } = errors;

const dataManagementApis = {
  oneOrNone: async function (queryString, paramArr) {
    let connection, result, error;

    try {
      connection = await pool.connect();
      result = await connection.oneOrNone(queryString, paramArr);
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) throw new DatabaseError(error.message);

    return result;
  },

  queryNoReturn: async function (queryString, paramArr) {
    let connection, error;

    try {
      connection = await pool.connect();
      await connection.query(queryString, paramArr);
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) throw new DatabaseError(error.message);
  },

  query: async function (queryString, paramArr) {
    let connection, error, result;

    try {
      connection = await pool.connect();
      result = await connection.query(queryString, paramArr);
    } catch (err) {
      error = err;
    } finally {
      if (connection) {
        await connection.done();
      }
    }

    if (error) throw new DatabaseError(error.message);

    return result;
  },
};

export default dataManagementApis;
