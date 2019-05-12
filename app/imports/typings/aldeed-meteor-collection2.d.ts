/* eslint-disable */
declare module 'meteor/mongo' {
  namespace Mongo {
    interface Collection<T> { // tslint:disable-line
      attachSchema(ss: any, options?: [object]): any;
      get(name: string): any;
    }
    interface CollectionStatic { // tslint:disable-line
      get(name: string): any;
    }
  }
}
