import faker from 'faker';
import moment from 'moment';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import slugify, { Slugs } from '../slug/SlugCollection';
import { makeSampleIce } from '../ice/SampleIce';

/**
 * Creates an OpportunityType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated OpportunityType.
 * @memberOf api/opportunity
 */
export const makeSampleOpportunityType = (): string => {
  const name = faker.lorem.words();
  const slug = slugify(`opportunity-type-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  return OpportunityTypes.define({ name, slug, description });
};

/**
 * Creates an Opportunity with a unique slug and returns its docID.
 * @param sponsor The slug for the user (with Role.FACULTY) to be the sponsor for this opportunity.
 * Also creates a new OpportunityType.
 * @returns { String } The docID for the newly generated Opportunity.
 * @memberOf api/opportunity
 */
export const makeSampleOpportunity = (sponsor: string): string => {
  const name = faker.lorem.words();
  const slug = slugify(`opportunity-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  const opportunityType = makeSampleOpportunityType();
  const interests = makeSampleInterestArray(2);
  const ice = makeSampleIce();
  return Opportunities.define({ name, slug, description, opportunityType, sponsor, interests, ice });
};

/**
 * Creates an array of defined opportunity slugs.
 * @param sponsor the sponsor of the opportunity.
 * @param num the number of opportunities to define. Defaults to 1.
 * @return An array of defined opportunity slugs.
 */
export const makeSampleOpportunitySlugArray = (sponsor: string, num = 1): string[] => {
  const retVal = [];
  for (let i = 0; i < num; i++) {
    retVal.push(Slugs.getNameFromID(Opportunities.findDoc(makeSampleOpportunity(sponsor)).slugID));
  }
  return retVal;
};

/**
 * Creates an OpportunityInstance with a unique slug and returns its docID.
 * @param student The slug for the user (with ROLE.STUDENT) who is taking advantage of this opportunity.
 * @param sponsor The slug for the user (with ROLE.FACULTY) who is sponsoring the opportunity.
 * Implicitly creates an Opportunity and an OpportunityType.
 * @memberOf api/opportunity
 */
export const makeSampleOpportunityInstance = (student: string, sponsor: string): string => {
  const opportunity: string = makeSampleOpportunity(sponsor);
  const academicTerm = makeSampleAcademicTerm();
  const verified = false;
  return OpportunityInstances.define({ academicTerm, opportunity, sponsor, verified, student });
};
