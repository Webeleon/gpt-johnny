import { INestApplication } from '@nestjs/common';
import { getTestingApp } from '../helpers/get-testing-app';
import { getAuthenticatedRequest } from '../helpers/authenticated-request';

describe('e2e: User profile', () => {
  let app: INestApplication;
  let authenticatedRequest;

  beforeEach(async () => {
    app = await getTestingApp();
    authenticatedRequest = await getAuthenticatedRequest(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return authenticatedRequest.get('/user/profile').expect(200);
  });
});
