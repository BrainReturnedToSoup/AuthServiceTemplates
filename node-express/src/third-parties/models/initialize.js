import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { ExistingRecordError } = errors;

export default {
  retrieveRecord: async function (name) {
    const exists = await dataManagementApis.oneOrNone(
      `
      SELECT third_party_id
      FROM third_parties
      WHERE third_party_name = $1
    `,
      [name]
    );

    if (exists)
      throw new ExistingRecordError(errorEnums.ExistingRecordError.THIRD_PARTY);
  },

  createThirdParty: async function (id, name, uri) {
    return await dataManagementApis.queryNoReturn(
      `
        INSERT INTO third_parties
        (
          third_party_id,
          third_party_name,
          third_party_uri
        )
        VALUES ($1, $2, $3)
        `,
      [id, name, uri]
    );
  },
};
