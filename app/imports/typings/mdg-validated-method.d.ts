/* eslint-disable */
declare module 'meteor/maestroqadev:validated-method' {
  class ValidatedMethod {
    constructor(options: object);
    public callPromise(args: any);
    public call(fixtures: any, callback?: (error?: any, result?: any) => any);
  }
}

declare module 'meteor/mdg:validated-method' {
  class ValidatedMethod {
    constructor(options: object);
    public callPromise(args: any);
    public call(fixtures: any, callback?: (error?: any, result?: any) => any);
  }
}
