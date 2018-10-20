declare module 'meteor/percolate:synced-cron' {
  const SyncedCron;
  namespace Accounts {
    function updateOrCreateUserFromExternalService(type: string, result: object, options: object): object;
    function removeDefaultRateLimit();
  }

}
