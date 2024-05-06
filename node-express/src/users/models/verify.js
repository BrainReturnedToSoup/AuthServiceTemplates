import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DataNotFoundError } = errors;

export default {
  getSessionData: async function (grantID) {
    const result = await dataManagementApis.oneOrNone(
      `
        SELECT user_id, jti
        FROM user_sessions
        WHERE grant_id = $1
        `,
      [grantID]
    );

    if (!result) throw new DataNotFoundError(errorEnums.DataNotFoundError.SESSION);

    return { userID: result.user_id, storedJti: result.jti };
  },

  updateJti: async function (grantID, jti) {
    await dataManagementApis.queryNoReturn(
      `
      UPDATE user_sessions
      SET jti = $1
      WHERE grant_id = $2
    `,
      [jti, grantID]
    );
  },
};
