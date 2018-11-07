declare module 'meteor/meteor' {
  namespace Meteor {
    const isAppTest: boolean;
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
