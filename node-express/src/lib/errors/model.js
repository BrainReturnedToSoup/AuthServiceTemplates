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
