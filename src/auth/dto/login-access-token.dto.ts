export class LoginAccessTokenDto {
  access_token: string;
  validEmail: boolean;
  validationCode?: string;
}
