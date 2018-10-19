declare module 'meteor/mdg:validated-method' {
  class ValidatedMethod {
    constructor(options: object);
    public callPromise(args: any);
    public call(fixtures: string[], done: () => any);
  }
}
