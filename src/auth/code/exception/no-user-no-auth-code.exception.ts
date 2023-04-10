export class NoUserNoAuthCodeException extends Error {
  constructor() {
    super('No user found, cannot generate auth code...');
  }
}
