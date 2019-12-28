import moment from 'moment';
import faker from 'faker';
import { InterestTypes } from './InterestTypeCollection';
import { Interests } from './InterestCollection';

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
  const slug = `${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  const description = faker.lorem.paragraph();
  // console.log('makeSampleInterest', { name, slug, description, interestType });
  return Interests.define({ name, slug, description, interestType });
}
