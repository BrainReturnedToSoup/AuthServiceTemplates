import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";

export default {
  deleteRecord: async function (thirdPartyID) {
    await dataManagementApis.queryNoReturn(
      `
      BEGIN;

      DELETE FROM third_party_sessions
      WHERE third_party_id = $1;

      DELETE FROM third_parties
      WHERE third_party_id = $1;

      COMMIT;
    `,
      [thirdPartyID]
    );
  },
};
