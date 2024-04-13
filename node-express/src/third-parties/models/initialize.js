import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
const {} = errors;

export default {
  checkExistingRecord: async function (name) {
    return await dataManagementApis.oneOrNone(
      `
      SELECT third_party_name
      FROM third_parties
      WHERE third_party_name = $1
    `,
      [name]
    );
  },

  createThirdParty: async function (id, name, uri) {
    return await dataManagementApis.queryNoReturn(
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
  },
};
