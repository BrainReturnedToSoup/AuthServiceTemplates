import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { ExistingRecordError } = errors;

export default {
  checkExistingUser: async function (emailUsername) {
    const exists = await dataManagementApis.oneOrNone(
      `
        SELECT email_username
        FROM users
        WHERE email_username = $1
        `,
      [emailUsername]
    );

    if (exists)
      throw new ExistingRecordError(errorEnums.ExistingRecordError.USER);
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
