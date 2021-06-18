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

/* MM:
 * Usernames aren't slugs anymore, so remove this.
 * 'doc' can be a document from many different collections, but all must have a slugID.
 * Proposal: Refactor as: BaseSlugCollection#getSlugName(doc)
 */
export const itemToSlugName = (doc): string => (doc.slugID ? Slugs.getNameFromID(doc.slugID) : doc.username);

/* MM:
 * Proposal: Refactor both to AcademicTerms#toName. Allow either a string (id) or doc (object) as parameter
 */
export const academicTermIdToName = (id: string): string => AcademicTerms.toString(id, false);
export const academicTermToName = (term): string => AcademicTerms.toString(term._id, false);

/* MM:
 * Proposal: Refactor as AcademicTerms#getDoc
 */
export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

/* MM:
 * Proposal: Refactor as AcademicTerms#toShortName
 */
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

/* MM:
 * Proposal: Refactor as AcademicTerms#toSlug
 */
export const academicTermNameToSlug = (name: string): string => itemToSlugName(AcademicTerms.getAcademicTermFromToString(name));

/* MM:
 * Proposal: Refactor as: CareerGoals#toName
 */
export const careerGoalIdToName = (id: string): string => CareerGoals.findDoc(id).name;

/* MM:
 * Proposal: Refactor as: CareerGoals#toSlug
 */
export const careerGoalNameToSlug = (name: string): string => itemToSlugName(CareerGoals.findDoc(name));

/* MM:
 * Delete. Replace by pre-existing Courses#getName.
 */
export const courseToName = (course): string => `${course.num}: ${course.shortName}`;

/* MM:
 * Delete. Replace by pre-existing Courses#getName.
 */
export const courseIdToName = (id: string): string => {
  const course = Courses.findDoc(id);
  return courseToName(course);
};

/* MM:
 * Proposal: Refactor to Courses#nameToDoc
 */
export const courseNameToCourseDoc = (name: string) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

/* MM:
 * Proposal: Refactor to Courses#nameToSlug
 */
export const courseNameToSlug = (name: string): string => itemToSlugName(Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) }));

/* MM:
 * Proposal: Delete. Replace by pre-existing Courses#getName
 */
export const courseSlugToName = (slug) => courseToName(Courses.findDoc(Slugs.getEntityID(slug, 'Course')));

/* MM:
 * Proposal: Delete. Replace by doc.name instead.
 */
export const docToName = (doc: HasName): string => doc.name;

/* MM:
 * Proposal: used multiple times in on UpdateTeasersForm so make it private to that file.
 */
export const docToSlugNameAndType = (doc: HasSlugID) => `${Slugs.findDoc(doc.slugID).name} (${Slugs.findDoc(doc.slugID).entityName})`;

/* MM:
 * Proposal: Delete. Not used!
 */
export const docToShortName = (doc) => doc.shortName;

/* MM:
 * Proposal: Refactor to BaseCollection#toShortDescription
 */

/** Return the first sentence of the description field of the passed document, or the passed description if we get a sentence. */
export const docToShortDescription = (doc) => {
  // To understand the following regex, see https://stackoverflow.com/a/33202102/2038293
  const firstSentenceMatch = doc.description.match(/(^.*?[a-z]{2,}[.!?])\s+\W*[A-Z]/);
  return firstSentenceMatch ? firstSentenceMatch[1] : doc.description;
};

/* MM:
 * Proposal: Refactor to Interests#toName. Support either a doc or a docID.
 */
export const interestIdToName = (id) => Interests.findDoc(id).name;

/* MM:
 * Proposal: Refactor to Interests#getID. Support either a name or a doc.
 */
export const interestNameToId = (name) => Interests.findDoc(name)._id;

/* MM:
 * Proposal: Refactor to: BaseSlugCollection#nameToSlug
 */
export const interestNameToSlug = (name) => itemToSlugName(Interests.findDoc(name));

/* MM:
 * Proposal: Remove this, just inline in AddInterestForm.tsx.
 */
export const interestTypeNameToSlug = (name) => itemToSlugName(InterestTypes.findDoc(name));

/* MM:
 * Proposal: Remove this, just inline in ModelInterestsPage.tsx.
 */
export const interestTypeNameToId = (name) => InterestTypes.findDoc(name)._id;

/* MM:
 * Proposal: inline?
 */
export const opportunityIdToName = (id) => Opportunities.findDoc(id).name;

/* MM:
 * Proposal: ??
 */
export const opportunityNameToSlug = (name) => itemToSlugName(Opportunities.findDoc(name));

/* MM:
 * Proposal: Not used, delete?
 */
export const opportunityTerms = (opportuntiy) => {
  const academicTermIDs = opportuntiy.termIDs;
  const upcomingAcademicTerms = academicTermIDs.filter((termID) => AcademicTerms.isUpcomingTerm(termID));
  return upcomingAcademicTerms.map((termID) => AcademicTerms.toString(termID));
};

/* MM:
 * Proposal: Not used, delete.
 */
export const opportunityTermsNotTaken = (opportunity, studentID) => {
  const termIDs = opportunity.termIDs;
  const takenTermIDs = [];
  const termNames = [];
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const ois = OpportunityInstances.findNonRetired({ studentID, opportunityID: opportunity._id });
  ois.forEach((o) => {
    takenTermIDs.push(o.termID);
  });
  termIDs.forEach((termID) => {
    if (AcademicTerms.findDoc(termID).termNumber >= currentTerm.termNumber) {
      if (!(takenTermIDs.includes(termID))) {
        termNames.push(AcademicTerms.toString(termID));
      }
    }
  });
  return termNames.slice(0, 8);
};

/* MM:
 * Proposal: Not used, delete.
 */
export const unverifiedOpportunityTermNames = (opportunity, studentID) => {
  const termNames = [];
  const ois = OpportunityInstances.findNonRetired({ studentID, opportunityID: opportunity._id });
  ois.forEach((o) => {
    if (!o.verified) {
      termNames.push(AcademicTerms.toString(o.termID, false));
    }
  });
  return termNames;
};

/* MM:
 * Only used by getUniqFutureOpportunities, so integrate it below.
 */
export const getFutureOpportunities = (studentID: string): Opportunity[] => {
  const ois = OpportunityInstances.findNonRetired({ studentID });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const futureOIs = ois.filter((oi) => {
    const term = AcademicTerms.findDoc(oi.termID);
    return term.termNumber >= currentTerm.termNumber;
  });
  return futureOIs.map((oi) => Opportunities.findDoc(oi.opportunityID));
};

/* MM:
 * Proposal: only used in ProfileFutureOpportunitiesList.tsx, make it private local there.
 */
export const getUniqFutureOpportunities = (studentID: string): Opportunity[] => {
  const futureOpportunities = getFutureOpportunities(studentID);
  return _.uniqBy(futureOpportunities, '_id');
};

/* MM:
 * Proposal: only used in AddVerificationRequestForm.tsx, make it private local there.
 */
export const opportunityInstanceToName = (oi) => {
  const student = StudentProfiles.findDoc({ userID: oi.studentID }).username;
  const opportunity = Opportunities.findDoc(oi.opportunityID).name;
  const term = AcademicTerms.toString(oi.termID, false);
  return `${student}-${opportunity}-${term}`;
};

/* MM:
 * Proposal: only used in AddVerificationRequestForm.tsx, make it private local there.
 */
export const opportunityInstanceNameToUsername = (name) => {
  const parts = name.split('-');
  return parts[0];
};

/* MM:
 * Proposal: only used in AddVerificationRequestForm.tsx, make it private local there.
 */
export const opportunityInstanceNameToTermSlug = (name) => {
  const parts = name.split('-');
  const termParts = parts[2].split(' ');
  const term = termParts[0];
  const year = parseInt(termParts[1], 10);
  const termDoc = AcademicTerms.findDoc({ term, year });
  return Slugs.getNameFromID(termDoc.slugID);
};

/* MM:
 * Proposal: only used in AddVerificationRequestForm.tsx, make it private local there.
 */
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

/* MM:
 * Proposal: Refactor to OpportunityTypes#toSlug
 */
export const opportunityTypeNameToSlug = (name) => itemToSlugName(OpportunityTypes.findDoc(name));

/* MM:
 * Proposal: Delete, use inline.
 */
export const opportunityTypeIdToName = (id) => OpportunityTypes.findDoc(id).name;

/* MM:
 * Proposal: Never used, delete.
 */
export const profileGetCareerGoals = (profile) => {
  const userID = profile.userID;
  const favCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
  return favCareerGoals.map((fav) => CareerGoals.findDoc(fav.careerGoalID));
};

/* MM:
 * Proposal: only used in AdminDataModelCareerGoalsPage.tsx, make it private local there.
 */
export const profileGetCareerGoalIDs = (profile) => profileGetCareerGoals(profile).map((goal) => goal._id);

/* MM:
 * Proposal: only used in profileGetInterestIDs, make it private local to BaseProfileCollection
 */
export const profileGetInterests = (profile) => {
  const userID = profile.userID;
  const favInterests = ProfileInterests.findNonRetired({ userID });
  return favInterests.map((fav) => Interests.findDoc(fav.interestID));
};

/* MM:
 * Proposal: Refactor to BaseProfileCollection#getInterestIDs
 */
export const profileGetInterestIDs = (profile) => profileGetInterests(profile).map((p) => p._id);

/* MM:
 * Proposal: Never used, delete.
 */
export const profileToFullName = (profile) => Users.getFullName(profile.userID);

/* MM:
 * Proposal: Refactor to BaseProfile#toNameAndUsername
 */
export const profileToName = (profile) => `${profileToFullName(profile)} (${profile.username})`;

/* MM:
 * Proposal: Delete, make inline.
 */
export const profileToUsername = (profile) => profile.username;

/* MM:
 * Proposal: Delete, not used.
 */
export const profileIDToFullname = (profileID: string): string => {
  if (_.isUndefined(profileID)) {
    return '';
  }
  if (profileID === 'elispsis') {
    return '';
  }
  return Users.getFullName(profileID);
};

/* MM:
 * Proposal: Delete, not used.
 */
export const profileIDToPicture = (profileID: string): string => {
  if (_.isUndefined(profileID)) {
    return '';
  }
  if (profileID === 'elipsis') {
    return '/images/elipsis.png';
  }
  return Users.getProfile(profileID).picture || defaultProfilePicture;
};

/* MM:
 * Proposal: Needed in many forms to map entry to username. Keep as utility
 */
export const profileNameToUsername = (name) => name.substring(name.indexOf('(') + 1, name.indexOf(')'));

/* MM:
 * Proposal: Move to Slugs#getSlugNameAndType
 */
export const slugIDToSlugNameAndType = (slugID) => `${Slugs.findDoc(slugID).name} (${Slugs.findDoc(slugID).entityName})`;

/* MM:
 * Proposal: only used in AddTeaserForm.tsx, make it private local to that file
 */
export const slugNameAndTypeToName = (slugAndType) => slugAndType.split(' ')[0];

/* MM:
 * Proposal: only used in UpdateOpportunityForm.tsx, make it private local to that file
 */
export const userIdToName = (userID) => {
  const profile = Users.getProfile(userID);
  return `${Users.getFullName(userID)} (${profile.username})`;
};

/* MM:
 * Proposal: Delete, not used.
 */
export const userToFullName = (user) => Users.getFullName(user);

/* MM:
 * Proposal: Delete, not used.
 */
export const userToPicture = (user) => {
  const picture = Users.getProfile(user).picture;
  return picture || defaultProfilePicture;
};
