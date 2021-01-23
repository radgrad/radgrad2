/* eslint-disable */
declare module 'meteor/accounts-base' {
  namespace Accounts {
    function removeDefaultRateLimit(): any;
    function updateOrCreateUserFromExternalService(type: string, result: object, options: object): { userId: string };
  }
}
