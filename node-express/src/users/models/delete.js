import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";

export default {
  deleteUser: async function (userID) {
    await dataManagementApis.queryNoReturn(
      `
      BEGIN;

        DELETE FROM user_sessions
        WHERE user_id = $1;

        DELETE FROM users
        WHERE user_id = $1;
      
      COMMIT;
        `,
      [userID]
    );
  },
};
