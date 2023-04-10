export class AuthCodeAlreadyUsedException extends Error {
  constructor() {
    super('Code already used');
  }
}
