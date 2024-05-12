import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DataNotFoundError } = errors;

export default {
  getHashedPassword: async function (userID) {
    const result = await dataManagementApis.oneOrNone(
      `
      SELECT pw
      FROM Users
      WHERE user_id = $1
      `,
      [userID]
    );

    if (!result)
      throw new DataNotFoundError(errorEnums.DataNotFoundError.HASHED_PW);

    return result.pw;
  },

  getEmailUsername: async function (userID) {
    const result = await dataManagementApis.oneOrNone(
      `
      SELECT email_username
      FROM Users
      WHERE user_id = $1
      `,
      [userID]
    );

    if (!result)
      throw new DataNotFoundError(errorEnums.DataNotFoundError.EMAIL_USERNAME);

    return result.email_username;
  },
};
