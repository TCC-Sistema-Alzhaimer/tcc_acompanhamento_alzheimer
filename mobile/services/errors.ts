export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}
