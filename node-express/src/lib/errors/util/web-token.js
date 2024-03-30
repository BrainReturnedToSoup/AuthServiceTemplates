class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const enums = Object.freeze({
  EXPIRED: 1,
  INVALID: 2,
  NOT_BEFORE: 3,
  UNKNOWN: 4,
});

export default { TokenError, enums };
