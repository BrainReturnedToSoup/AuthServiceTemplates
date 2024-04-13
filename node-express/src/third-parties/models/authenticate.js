import dataManagementApis from "../../lib/utils/data-management/dataManagementApis";
import errors from "../../lib/errors/model";
import errorEnums from "../../lib/enums/error/model";
const { DataNotFoundError } = errors;

export default {
  getURI: async function (thirdPartyID) {
    const result = await dataManagementApis.oneOrNone(
      `
    SELECT uri
    FROM Third_Parties
    WHERE third_party_id = $1
    `,
      [thirdPartyID]
    );

    if (!result) throw new DataNotFoundError(errorEnums.DataNotFoundError.URI);

    return result.uri;
  },

  getUserIDandPassword: async function (emailUsername) {
    const result = await dataManagementApis.oneOrNone(
      `
    SELECT user_id, pw
    FROM Users
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

  createThirdPartySession: async function (
    userID,
    thirdPartyID,
    grantID,
    authorization,
    exp
  ) {
    await dataManagementApis.queryNoReturn(
      `INSERT INTO Third_Party_Sessions 
    ( 
      user_id,
      grant_id,
      third_party_id,
      authorization,
      exp
    )
   VALUES ($1, $2, $3, $4, $5) `,
      [userID, grantID, thirdPartyID, authorization, exp]
    );
  },
};
