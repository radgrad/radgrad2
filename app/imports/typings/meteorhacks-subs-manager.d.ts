declare module 'meteor/meteorhacks:subs-manager' {
  class SubsManager {
    constructor({ cacheLimit, expireIn });
    public subscribe(name: string, id?: string);
    public ready(): boolean;
  }
}
