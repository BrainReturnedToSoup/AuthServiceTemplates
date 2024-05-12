import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";

export default {
  updatePassword: async function (userID, newPassword) {
    await dataManagementApis.queryNoReturn(
      `
        UPDATE users
        SET pw = $1
        WHERE user_id = $2
        `,
      [newPassword, userID]
    );
  },

  updateEmailUsername: async function (userID, newEmailUsername) {
    await dataManagementApis.queryNoReturn(
      `
        UPDATE users
        SET email_username = $1
        WHERE user_id = $2
        `,
      [newEmailUsername, userID]
    );
  },
};
