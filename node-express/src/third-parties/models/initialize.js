import pool from "../../../data-management/postgres-pool";
import { DatabaseError } from "../../lib/errors/model";

export default {
  createThirdParty: async function (id, name, uri) {
    let connection, error;

    try {
      connection = await pool.connect();

      await connection.query(
        `
        INSERT INTO Third_Parties
        (
          third_party_id,
          name,
          uri
        )
        VALUES ($1, $2, $3)
        `,
        [id, name, uri]
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
