import pool from "../../../data-management/postgres-pool";
import { DatabaseError } from "../../lib/errors/model";

export default {
  deleteRecord: async function (thirdPartyID) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        DELETE FROM Third_Parties
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

    if (error) {
      throw new DatabaseError(error.message);
    }
  },
};
