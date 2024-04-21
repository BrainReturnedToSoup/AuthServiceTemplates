import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DataNotFoundError } = errors;

export default {
  getJti: async function (grantID) {
    const result = await dataManagementApis.oneOrNone(
      `
        SELECT jti
        FROM User_Sessions
        WHERE grant_id = $1
        `,
      [grantID]
    );

    if (!result) throw new DataNotFoundError(errorEnums.DataNotFoundError.JTI);

    return result.jti;
  },

  updateJti: async function (grantID, jti) {
    await dataManagementApis.queryNoReturn(
      `
      UPDATE User_Sessions
      SET jti = $1
      WHERE grant_id = $2
    `,
      [jti, grantID]
    );
  },
};
