import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";

export default {
  checkExistingUser: async function (emailUsername) {
    return (
      result !==
      (await dataManagementApis.oneOrNone(
        `
        SELECT emailUsername
        FROM users
        WHERE emailUsername = $1
        `,
        [emailUsername]
      ))
    );
  },

  createUser: async function (userID, emailUsername, hashedPassword) {
    await dataManagementApis.queryNoReturn(
      `
        INSERT INTO Users (user_id, email_username, pw)
        VALUES ($1, $2, $3)
        `,
      [userID, emailUsername, hashedPassword]
    );
  },
};
