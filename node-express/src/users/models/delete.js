import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";

export default {
  deleteUser: async function (userID) {
    await dataManagementApis.queryNoReturn(
      `
        DELETE FROM Users
        WHERE user_id = $1
        `,
      [userID]
    );
  },
};
