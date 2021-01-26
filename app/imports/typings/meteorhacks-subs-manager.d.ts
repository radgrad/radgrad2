/* eslint-disable */
declare module 'meteor/meteorhacks:subs-manager' {
  class SubsManager {
    constructor(properties: { cacheLimit: number; expireIn: number });
    public subscribe(name: string, id?: string);
    public ready(): boolean;
  }
}
