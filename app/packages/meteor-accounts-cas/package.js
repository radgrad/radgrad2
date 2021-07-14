Package.describe({
  summary: "CAS support for accounts",
  version: "0.0.3",
  name: "radgrad:accounts-cas",
  git: "https://github.com/radgrad/meteor-accounts-cas"
});

Package.onUse(function(api) {
  api.versionsFrom(['1.2', '2.3']);
  api.use('routepolicy', 'server');
  api.use('webapp', 'server');
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('underscore');


  api.mainModule('cas_client.js', 'web.browser');
  api.mainModule('cas_client_cordova.js', 'web.cordova');
  api.mainModule('cas_server.js', 'server');

});

Npm.depends({
  cas: "0.0.3"
});

Cordova.depends({
  'cordova-plugin-inappbrowser': '1.2.0'
});
