/* eslint-disable */
declare module 'meteor/meteor' {
  namespace Meteor {
    const isAppTest: boolean;
    function loginWithCas(options: object, callback?: (error?: any, result?: any) => void): any;
    const roleAssignment: any;
  }
  namespace Accounts {
    function removeDefaultRateLimit(): any;
  }
  namespace Assets {
    function getBinary(assetPath: string, asyncCallback?: () => void): EJSON;

    function getText(assetPath: string, asyncCallback?: () => void): string;

    function absoluteFilePath(assetPath: string): string;
  }
}
