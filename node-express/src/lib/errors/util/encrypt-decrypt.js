class EncryptError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DecryptError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export { EncryptError, DecryptError };
