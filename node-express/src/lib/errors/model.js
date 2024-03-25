export class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const enums = Object.freeze({
  DataNotFoundError: Object.freeze({
    USER_ID_HASHED_PW: 1,
    HASHED_PW: 2,
    EMAIL_USERNAME: 3,
    JTI: 4
  }),
});
