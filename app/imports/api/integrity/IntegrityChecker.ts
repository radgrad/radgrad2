import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import { RadGrad } from '../radgrad/RadGrad';

/**
 * Checks the integrity of all the collection classes in RadGrad.
 * @returns {{count: number, message: string}}
 * @memberOf api/integrity
 */
export const checkIntegrity = (): { count: number, message: string } => {
  let message = `Integrity check results (${moment().format('MMM Do YYYY, H:mm:ss a')})`;
  const startTime = moment();
  let count = 0;
  _.sortBy(RadGrad.collections, (c) => c.collectionName).forEach((collection) => {
    message += `\n  ${collection.collectionName} (${collection.count()})`;
    const collectionStrings = collection.checkIntegrity();
    collectionStrings.forEach((collectionString) => {
      count += 1;
      message += `\n    ${collectionString}`;
    });
  });
  message += `\nTotal problems: ${count}`;
  const endTime = moment();
  message += `\nElapsed time: ${endTime.diff(startTime, 'seconds', true)} seconds`;
  return { count, message };
};

/**
 * Checks the integrity of the database, and throws an Error if there are any integrity problems.
 * @returns Null if nothing is wrong.
 * @throws { Meteor.Error } If there is an integrity problem.
 * @memberOf api/integrity
 */
export const assertIntegrity = (): null => {
  console.log('assertIntegrity');
  const { count, message } = checkIntegrity();
  if (count > 0) {
    throw new Meteor.Error(message);
  }
  return null;
};
