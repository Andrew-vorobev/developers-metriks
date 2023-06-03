import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://gitlab.com',
  // checkOrigin: false,
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://localhost:4200/auth',
  responseType: 'code',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'bba4f0499d8031d8d0341c56df3fbc43370348ad9732fed76bdb41ac403a63cb',
  dummyClientSecret:
    '8935521ed43cffdf4a2a5bf58f68ce47109740fa9d3bdc8ae894b1cb384fe8e5',

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
