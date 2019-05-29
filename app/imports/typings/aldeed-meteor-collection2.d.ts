/* eslint-disable */
declare module 'meteor/mongo' {
  namespace Mongo {
    interface Collection<T> {
      attachSchema(ss: any, options?: [object]): any;
      get(name: string): any;
    }
    interface CollectionStatic {
      get(name: string): any;
    }
  }
}
