declare module 'meteor/meteorhacks:subs-manager' {
  class SubsManager {
    constructor({ cacheLimit, expireIn });
    public subscribe(name);
    public ready(): boolean;
  }
}
