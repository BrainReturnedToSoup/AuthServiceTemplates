class InputValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const enums = Object.freeze({
  EMAIL_USERNAME: 1,
  PASSWORD: 2,
  THIRD_PARTY_ID: 3,
  THIRD_PARTY_NAME: 4,
  THIRD_PARTY_URI: 5,
  USER_ID: 6,
});

export default { InputValidationError, enums };
