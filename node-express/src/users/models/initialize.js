import pool from "../../../data-management/postgres-pool";
import modelErrors from "../../lib/errors/model";

const { DatabaseError } = modelErrors;

export default {
  createUser: async function (userID, emailUsername, hashedPassword) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        INSERT INTO Users (user_id, email_username, pw)
        VALUES ($1, $2, $3)
        `,
        [userID, emailUsername, hashedPassword]
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
