export class AuthCodeNotFoundException extends Error {
  constructor() {
    super('Code not found');
  }
}
