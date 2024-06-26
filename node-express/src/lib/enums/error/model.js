const enums = Object.freeze({
  DataNotFoundError: Object.freeze({
    USER_ID_HASHED_PW: "USER-ID-HASHED-PW",
    HASHED_PW: "HASHED-PW",
    EMAIL_USERNAME: "EMAIL-USERNAME",
    USER_ID: "USER-ID",
    SESSION: "SESSION",
    URI: "URI",
    USER_ID_THIRD_PARTY_ID: "USER_ID_THIRD_PARTY_ID",
  }),

  ExistingRecordError: Object.freeze({
    THIRD_PARTY: "THIRD-PARTY",
    USER: "USER"
  })
});

export default enums;
