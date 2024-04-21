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

class ExistingRecordError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export default { DataNotFoundError, DatabaseError, ExistingRecordError };
