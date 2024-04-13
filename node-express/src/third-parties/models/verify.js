import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DataNotFoundError } = errors;

export default {
  getSessionIDs: async function (grantID) {
    const result = await dataManagementApis.oneOrNone(
      `
    SELECT user_id, third_party_id
    FROM Third_Party_Sessions
    WHERE grant_id = $1
    `,
      [grantID]
    );

    if (!result)
      throw new DataNotFoundError(
        errorEnums.DataNotFoundError.USER_ID_THIRD_PARTY_ID
      );

    return { userID: result.user_id, thirdPartyID: result.third_party_id };
  },

  verifyUserID: async function (userID) {
    const result = await dataManagementApis.oneOrNone(
      `
    SELECT user_id
    FROM Users
    WHERE user_id = $1
    `,
      [userID]
    );

    if (!result)
      throw new DataNotFoundError(errorEnums.DataNotFoundError.USER_ID);
  },
};
