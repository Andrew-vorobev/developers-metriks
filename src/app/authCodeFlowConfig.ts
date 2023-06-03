import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://gitlab.com',
  // checkOrigin: false,
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://81.200.151.177/auth',
  responseType: 'code',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'c8635ad9e40068b01e8d060ae89aaa110d58daa86c978988ee417359da4bf38f',
  dummyClientSecret:
    '50f38de82fcb4c015b30a50859da5414118f37753528d92cdbe59ce81f2ca485',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  // responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope:
    'api read_api read_user read_repository read_registry read_observability openid profile email',

  showDebugInformation: false,
};
