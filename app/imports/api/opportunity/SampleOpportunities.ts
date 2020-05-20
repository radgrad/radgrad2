import faker from 'faker';
import moment from 'moment';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import slugify from '../slug/SlugCollection';
import { makeSampleAcademicTermArray } from '../academic-term/SampleAcademicTerms';
import { makeSampleIce } from '../ice/SampleIce';

/**
 * Creates an OpportunityType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated OpportunityType.
 * @memberOf api/opportunity
 */
export function makeSampleOpportunityType() {
  const name = faker.lorem.words();
  const slug = slugify(`opportunity-type-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  return OpportunityTypes.define({ name, slug, description });
}

/**
 * Creates an Opportunity with a unique slug and returns its docID.
 * @param sponsor The slug for the user (with Role.FACULTY) to be the sponsor for this opportunity.
 * Also creates a new OpportunityType.
 * @returns { String } The docID for the newly generated Opportunity.
 * @memberOf api/opportunity
 */
export function makeSampleOpportunity(sponsor) {
  const name = faker.lorem.words();
  const slug = slugify(`opportunity-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  const opportunityType = makeSampleOpportunityType();
  const interests = makeSampleInterestArray(2);
  const academicTerms = makeSampleAcademicTermArray();
  const ice = makeSampleIce();
  return Opportunities.define({ name, slug, description, opportunityType, sponsor, interests, academicTerms, ice });
}

/**
 * Creates an OpportunityInstance with a unique slug and returns its docID.
 * @param student The slug for the user (with ROLE.STUDENT) who is taking advantage of this opportunity.
 * @param sponsor The slug for the user (with ROLE.FACULTY) who is sponsoring the opportunity.
 * Implicitly creates an Opportunity and an OpportunityType.
 * @memberOf api/opportunity
 */
export function makeSampleOpportunityInstance(student: string, sponsor: string) {
  const opportunity: string = makeSampleOpportunity(sponsor);
  const academicTerm = Opportunities.findDoc(opportunity).termIDs[0];
  const verified: boolean = false;
  return OpportunityInstances.define({ academicTerm, opportunity, sponsor, verified, student });
}
