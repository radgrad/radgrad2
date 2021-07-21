import _ from 'lodash';

import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { InterestTypes } from '../../../../api/interest/InterestTypeCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { defaultProfilePicture } from '../../../../api/user/BaseProfileCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../../../../api/user/profile-entries/ProfileInterestCollection';
import { AcademicTerm, Opportunity } from '../../../../typings/radgrad';
// import Router from './RouterHelperFunctions';

interface HasName {
  name: string;
}

interface HasSlugID {
  slugID: string;
}

export const itemToSlugName = (doc): string => (doc.slugID ? Slugs.getNameFromID(doc.slugID) : doc.username);

export const academicTermIdToName = (id: string): string => AcademicTerms.toString(id, false);

export const academicTermToName = (term): string => AcademicTerms.toString(term._id, false);

export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

export const academicTermNameToShortName = (termID): string => {
  const academicTerm: AcademicTerm = AcademicTerms.findOne(termID);
  const termYear = `${academicTerm.year}`.substring(2, 4);

  let termName: string;
  switch (academicTerm.term) {
    case 'Spring':
      termName = 'Spr';
      break;
    case 'Fall':
      termName = 'Fall';
      break;
    case 'Summer':
      termName = 'Sum';
      break;
    case 'Winter':
      termName = 'Win';
      break;
    default:
      termName = 'N/A';
      break;
  }
  return `${termName} ${termYear}`;
};

export const academicTermNameToSlug = (name: string): string => itemToSlugName(AcademicTerms.getAcademicTermFromToString(name));

export const careerGoalIdToName = (id: string): string => CareerGoals.findDoc(id).name;

export const careerGoalNameToSlug = (name: string): string => itemToSlugName(CareerGoals.findDoc(name));

export const courseToName = (course): string => Courses.getName(course._id);

export const courseIdToName = (id: string): string => {
  const course = Courses.findDoc(id);
  return courseToName(course);
};

export const courseNameToCourseDoc = (name: string) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

export const courseNameToSlug = (name: string): string => itemToSlugName(Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) }));

export const courseSlugToName = (slug) => courseToName(Courses.findDoc(Slugs.getEntityID(slug, 'Course')));

export const docToName = (doc: HasName): string => doc.name;

export const docToSlugNameAndType = (doc: HasSlugID) => `${Slugs.findDoc(doc.slugID).name} (${Slugs.findDoc(doc.slugID).entityName})`;

export const docToShortName = (doc) => doc.shortName;

/** Return the first sentence of the description field of the passed document, or the passed description if we get a sentence. */
export const docToShortDescription = (doc) => {
  // To understand the following regex, see https://stackoverflow.com/a/33202102/2038293
  const firstSentenceMatch = doc.description.match(/(^.*?[a-z]{2,}[.!?])\s+\W*[A-Z]/);
  return firstSentenceMatch ? firstSentenceMatch[1] : doc.description;
};

export const interestIdToName = (id) => Interests.findDoc(id).name;

export const interestNameToId = (name) => Interests.findDoc(name)._id;

export const interestNameToSlug = (name) => itemToSlugName(Interests.findDoc(name));

export const interestTypeNameToSlug = (name) => itemToSlugName(InterestTypes.findDoc(name));

export const interestTypeNameToId = (name) => InterestTypes.findDoc(name)._id;

export const opportunityIdToName = (id) => Opportunities.findDoc(id).name;

export const opportunityNameToSlug = (name) => itemToSlugName(Opportunities.findDoc(name));

export const opportunityTerms = (opportuntiy) => {
  const academicTermIDs = opportuntiy.termIDs;
  const upcomingAcademicTerms = academicTermIDs.filter((termID) => AcademicTerms.isUpcomingTerm(termID));
  return upcomingAcademicTerms.map((termID) => AcademicTerms.toString(termID));
};

export const getFutureOpportunities = (studentID: string): Opportunity[] => {
  const ois = OpportunityInstances.findNonRetired({ studentID });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const futureOIs = ois.filter((oi) => {
    const term = AcademicTerms.findDoc(oi.termID);
    return term.termNumber >= currentTerm.termNumber;
  });
  // TODO should this be uniq?
  return futureOIs.map((oi) => Opportunities.findDoc(oi.opportunityID));
};

export const getUniqFutureOpportunities = (studentID: string): Opportunity[] => {
  const futureOpportunities = getFutureOpportunities(studentID);
  return _.uniqBy(futureOpportunities, '_id');
};

export const opportunityInstanceToName = (oi) => {
  const student = StudentProfiles.findDoc({ userID: oi.studentID }).username;
  const opportunity = Opportunities.findDoc(oi.opportunityID).name;
  const term = AcademicTerms.toString(oi.termID, false);
  return `${student}-${opportunity}-${term}`;
};

export const opportunityInstanceNameToUsername = (name) => {
  const parts = name.split('-');
  return parts[0];
};

export const opportunityInstanceNameToTermSlug = (name) => {
  const parts = name.split('-');
  const termParts = parts[2].split(' ');
  const term = termParts[0];
  const year = parseInt(termParts[1], 10);
  const termDoc = AcademicTerms.findDoc({ term, year });
  return Slugs.getNameFromID(termDoc.slugID);
};

export const opportunityInstanceNameToId = (name) => {
  const parts = name.split('-');
  const opportunityDoc = Opportunities.findDoc(parts[1]);
  const opportunityID = opportunityDoc._id;
  const termParts = parts[2].split(' ');
  const term = termParts[0];
  const year = parseInt(termParts[1], 10);
  const termDoc = AcademicTerms.findDoc({ term, year });
  const termID = termDoc._id;
  const profile = StudentProfiles.findDoc({ username: parts[0] });
  const studentID = profile.userID;
  return OpportunityInstances.findDoc({ opportunityID, termID, studentID })._id;
};

export const opportunityTypeNameToSlug = (name) => itemToSlugName(OpportunityTypes.findDoc(name));

export const opportunityTypeIdToName = (id) => OpportunityTypes.findDoc(id).name;

export const profileGetCareerGoals = (profile) => {
  const userID = profile.userID;
  const favCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
  return favCareerGoals.map((fav) => CareerGoals.findDoc(fav.careerGoalID));
};

export const profileGetCareerGoalIDs = (profile) => profileGetCareerGoals(profile).map((goal) => goal._id);

export const profileGetInterests = (profile) => {
  const userID = profile.userID;
  const favInterests = ProfileInterests.findNonRetired({ userID });
  return favInterests.map((fav) => Interests.findDoc(fav.interestID));
};

export const profileGetInterestIDs = (profile) => profileGetInterests(profile).map((p) => p._id);

export const profileToFullName = (profile) => Users.getFullName(profile.userID);

export const profileToName = (profile) => `${profileToFullName(profile)} (${profile.username})`;

export const profileToUsername = (profile) => profile.username;

export const profileIDToFullname = (profileID: string): string => {
  if (_.isUndefined(profileID)) {
    return '';
  }
  if (profileID === 'elispsis') {
    return '';
  }
  return Users.getFullName(profileID);
};

export const profileIDToPicture = (profileID: string): string => {
  if (_.isUndefined(profileID)) {
    return '';
  }
  if (profileID === 'elipsis') {
    return '/images/elipsis.png';
  }
  return Users.getProfile(profileID).picture || defaultProfilePicture;
};

export const profileNameToUsername = (name) => name.substring(name.indexOf('(') + 1, name.indexOf(')'));

export const slugIDToSlugNameAndType = (slugID) => `${Slugs.findDoc(slugID).name} (${Slugs.findDoc(slugID).entityName})`;

export const slugNameAndTypeToName = (slugAndType) => slugAndType.split(' ')[0];

export const userIdToName = (userID) => {
  const profile = Users.getProfile(userID);
  return `${Users.getFullName(userID)} (${profile.username})`;
};

export const userToFullName = (user) => Users.getFullName(user);

export const userToPicture = (user) => {
  const picture = Users.getProfile(user).picture;
  return picture || defaultProfilePicture;
};
