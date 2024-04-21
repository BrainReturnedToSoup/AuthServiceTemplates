import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DataNotFoundError } = errors;

export default {
  getUserIDandHashedPw: async function (emailUsername) {
    const result = await dataManagementApis.oneOrNone(
      `
    SELECT user_id, pw
    FROM users
    WHERE email_username = $1
  `,
      [emailUsername]
    );

    if (!result)
      throw new DataNotFoundError(
        errorEnums.DataNotFoundError.USER_ID_HASHED_PW
      );

    return { userID: result.user_id, hashedPassword: result.pw };
  },

  createSessionRecord: async function (userID, grantID, jti, exp) {
    await dataManagementApis.queryNoReturn(
      `
    INSERT INTO User_Sessions (grant_id, user_id, jti, expiration)
    VALUES ($1, $2, $3, $4)
  `,
      [userID, grantID, jti, exp]
    );
  },
};
