export class DoesNotMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const enums = Object.freeze({
  DoesNotMatchError: Object.freeze({
    PASSWORD: 1,
    EMAIL_USERNAME: 2,
    THIRD_PARTY_ID: 3,
    JTI: 4,
  }),
});
