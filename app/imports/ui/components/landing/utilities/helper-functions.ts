import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { Opportunity } from '../../../../typings/radgrad';

export const itemShortDescription = (item: { description: string; }): string => {
  let description = item.description;
  if (description.length > 200) {
    description = `${description.substring(0, 200)}`;
    if (description.charAt(description.length - 1) === ' ') {
      description = `${description.substring(0, 199)}`;
    }
  }
  return description;
};

export const getSlug = (item: { slugID: string; }): string => {
  try {
    return Slugs.getNameFromID(item.slugID);
  } catch (e) {
    console.log('helper-functions.getSlug', e, item);
    // console.trace();
    return '';
  }
};

export const getSlugFromEntityID = (entityID) => {
  try {
    return Slugs.findDoc({ entityID }).name;
  } catch (e) {
    return '';
  }
};

export const getOpportunityTypeName = (opportunityTypeID) => {
  try {
    return OpportunityTypes.findDoc(opportunityTypeID).name;
  } catch (e) {
    return '';
  }
};

export const teaser = (opportunity: Opportunity) => {
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

export const semesters = (opportunity) => {
  const termIDs = opportunity.termIDs;
  const array = termIDs.map((semID) => AcademicTerms.toString(semID));
  const semString = array.join(', ');
  return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
};

export const getRouteName = (path: string): string => {
  let regex = /plans/;
  if (regex.test(path)) {
    return 'Academic Plans';
  }
  regex = /career-goals/;
  if (regex.test(path)) {
    return 'Career Goals';
  }
  regex = /courses/;
  if (regex.test(path)) {
    return 'Courses';
  }
  regex = /interests/;
  if (regex.test(path)) {
    return 'Interests';
  }
  regex = /opportunities/;
  if (regex.test(path)) {
    return 'Opportunities';
  }
  return 'Undefined';
};
