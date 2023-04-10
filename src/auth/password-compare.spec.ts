import { comparePassword, hashPassword } from './hash-password';

describe('[auth] hash and compare password', () => {
  const password = 'coco';
  it('hash using different hashes with the same password', async () => {
    expect(await hashPassword(password)).not.toBe(password);
    expect(await hashPassword(password)).not.toBe(await hashPassword(password));
    console.log(await hashPassword(password));
  });

  it('compare hash with password', async () => {
    expect(
      await comparePassword(
        password,
        '$2b$10$hp8mLu9qT4hhgHwF6CeU7OJvTSHOtFezwOrQAJBAwHjJEYC2BvdCC',
      ),
    ).toBe(true);
    expect(
      await comparePassword(
        'another one',
        '$2b$10$hp8mLu9qT4hhgHwF6CeU7OJvTSHOtFezwOrQAJBAwHjJEYC2BvdCC',
      ),
    ).toBe(false);
  });
});
