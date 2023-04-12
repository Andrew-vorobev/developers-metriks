import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://gitlab.com',
  // checkOrigin: false,
  strictDiscoveryDocumentValidation: false,
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/auth',
  responseType: 'code',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '5a196ef9575e63dc28676d5c1def1d26f867b6bc008895fce019fdc1360ab7e6',
  dummyClientSecret:
    '4371de8d5f894bad7d667a719c1d476190b0653be57f2835632d36d90a09a378',

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
  scope: 'read_api openid email profile api',

  showDebugInformation: true,
};
