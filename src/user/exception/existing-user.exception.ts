export class ExistingUserException extends Error {
  constructor() {
    super(`Already registered username or email.`);
  }
}
