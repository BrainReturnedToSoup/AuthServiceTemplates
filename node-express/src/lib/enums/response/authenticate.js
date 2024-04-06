const responseEnums = Object.freeze({
  doesNotMatchError: "INVALID-CREDENTIALS",
  databaseError: "DATABASE-ERROR:UNKNOWN",
  dataNotFoundError: "DATA-NOT-FOUND",
  inputValidationError: "INPUT-VALIDATION",
  tokenError: {
    notBefore: "TOKEN-ERROR:NOT-BEFORE",
    unknown: "TOKEN-ERROR:UNKNOWN",
  },
  serverError: "SERVER-ERROR",
});

export default responseEnums;
