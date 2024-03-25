export class DoesNotMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const enums = Object.freeze({
  DoesNotMatchError: Object.freeze({
    THIRD_PARTY_ID: 1,
    JTI: 2,
  }),
});
