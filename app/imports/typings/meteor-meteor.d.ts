declare module 'meteor/meteor' {
  namespace Meteor {
    const isAppTest: boolean;
  }
  namespace Assets {
    function getText(assetPath: string, asyncCallback?: (error, result) => any);
  }
  namespace Accounts {
    function removeDefaultRateLimit(): any;
  }
}
