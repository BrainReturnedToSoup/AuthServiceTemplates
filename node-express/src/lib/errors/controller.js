class DoesNotMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ExistingUser extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const enums = Object.freeze({
  DoesNotMatchError: Object.freeze({
    EMAIL_USERNAME: 1,
    PASSWORD: 2,
    THIRD_PARTY_ID: 3,
    JTI: 4,
  }),
});

export default { DoesNotMatchError, ExistingUser, enums };
