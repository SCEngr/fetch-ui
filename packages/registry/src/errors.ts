export class APIError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}
