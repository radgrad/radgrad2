import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import simplSchema from 'simpl-schema';

/** Create a Meteor collection. */
// console.log('creating collection stuffs');
// console.trace('creating collection stuffs');

const name: string = 'Stuffs';

// console.time('Stuffs'); // tslint:disable-line
const Stuffs = new Mongo.Collection(name);
// console.timeEnd('Stuffs'); // tslint:disable-line

/** Create a schema to constrain the structure of documents associated with this collection. */
const StuffSchema = new simplSchema({
  condition: {
    allowedValues: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: 'good',
    type: String,
  },
  name: String,
  owner: String,
  quantity: Number,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Stuffs.attachSchema(StuffSchema);

/** Make the collection and schema available to other code. */
export { Stuffs, StuffSchema };
