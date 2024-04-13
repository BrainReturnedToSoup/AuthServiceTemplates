import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";

export default {
  deleteRecord: async function (thirdPartyID) {
    await dataManagementApis.queryNoReturn(
      `
    DELETE FROM Third_Parties
    WHERE third_party_id = $1
    `,
      [thirdPartyID]
    );
  },
};
