/* eslint-disable */
declare module 'meteor/meteor' {
  namespace Meteor {
    const isAppTest: boolean;
    function loginWithCas(callback?: (error?: any, result?: any) => void): any;
    const roleAssignment: any;
    function publishLite(collectionName: string, f: () => void);
    function subscribeLite(collectionName: string, userID?: string);
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
