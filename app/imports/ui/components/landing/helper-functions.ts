import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicTerms } from '../../../api/semester/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';

export function itemShortDescription(item: { description: string; }) {
  let description = item.description;
  if (description.length > 200) {
    description = `${description.substring(0, 200)}`;
    if (description.charAt(description.length - 1) === ' ') {
      description = `${description.substring(0, 199)}`;
    }
  }
  return description;
}

export function getSlug(item: { slugID: string; }) {
  try {
    return Slugs.getNameFromID(item.slugID);
  } catch (e) {
    console.log(e, item.slugID);
    return '';
  }
}

export function getSlugFromEntityID(entityID) {
  try {
    return Slugs.findDoc({ entityID }).name;
  } catch (e) {
    return '';
  }
}

export function getOpportunityTypeName(opportunityTypeID) {
  try {
    return OpportunityTypes.findDoc(opportunityTypeID).name;
  } catch (e) {
    return '';
  }
}

export function teaser(opportunity) {
  try {
    const t = Teasers.findDoc({ opportunityID: opportunity._id });
    const url = t.url;
    return url;
  } catch (e) {
    return '';
  }
}

export function semesters(opportunity) {
  const termIDs = opportunity.termIDs;
  const array = _.map(termIDs, (semID) => AcademicTerms.toString(semID));
  const semString = array.join(', ');
  return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
}

export function getRouteName(path: string): string {
  let regex = /academic-plans/;
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
  regex = /degrees/;
  if (regex.test(path)) {
    return 'Degrees';
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
}
