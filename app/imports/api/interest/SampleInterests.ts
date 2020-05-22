import moment from 'moment';
import faker from 'faker';
import _ from 'lodash';
import { InterestTypes } from './InterestTypeCollection';
import { Interests } from './InterestCollection';
import slugify, { Slugs } from '../slug/SlugCollection';

/**
 * Creates an InterestType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated InterestType.
 * @memberOf api/interest
 */
export function makeSampleInterestType(): string {
  const name = faker.lorem.word();
  const slug = `${name}-type-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  const description = faker.lorem.paragraph();
  // console.log('makeSampleInterestType', name, slug, description);
  return InterestTypes.define({ name, slug, description });
}

/**
 * Creates an Interest with a unique slug and returns its docID.
 * Also creates a new InterestType.
 * @returns { String } The docID for the newly generated Interest.
 * @memberOf api/interest
 */
export function makeSampleInterest(): string {
  const interestType = makeSampleInterestType();
  const name = faker.lorem.word();
  const slug = slugify(`${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  // console.log('makeSampleInterest', { name, slug, description, interestType });
  return Interests.define({ name, slug, description, interestType });
}

/**
 * Returns an array of interestIDs.
 * @param {number} numInterests the number of interestIDs. Defaults to 1.
 * @returns {string[]}
 */
export function makeSampleInterestArray(numInterests: number = 1): string[] {
  const retVal = [];
  for (let i = 0; i < numInterests; i++) {
    retVal.push(makeSampleInterest());
  }
  return retVal;
}

/**
 * Returns an array of defined Interest slugs.
 * @param numInterests the number of Interests to define. Defaults to 1.
 * @return {string[]} An array of defined Interest Slugs.
 */
export function makeSampleInterestSlugArray(numInterests = 1): string[] {
  const ids = makeSampleInterestArray(numInterests);
  return _.map(ids, (id) => {
    const doc = Interests.findDoc(id);
    return Slugs.getNameFromID(doc.slugID);
  });
}
