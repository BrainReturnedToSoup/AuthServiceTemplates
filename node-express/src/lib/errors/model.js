class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const enums = Object.freeze({
  DataNotFoundError: Object.freeze({
    USER_ID_HASHED_PW: 1,
    HASHED_PW: 2,
    EMAIL_USERNAME: 3,
    USER_ID: 4,
    JTI: 5,
    URI: 6,
    USER_ID_THIRD_PARTY_ID: 7,
  }),
});

export default { DataNotFoundError, DatabaseError, enums };
