class DoesNotMatchError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const enums = Object.freeze({
  DoesNotMatchError: Object.freeze({
    THIRD_PARTY_ID: 1,
    JTI: 2,
  }),
});

export default { DoesNotMatchError, enums };
