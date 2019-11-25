import * as _ from 'lodash';

import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
// import * as Router from './RouterHelperFunctions';

interface IHasName {
  name: string;
}

interface IHasSlugID {
  slugID: string;
}

export const itemToSlugName = (doc) => (doc.slugID ? Slugs.getNameFromID(doc.slugID) : doc.username);

export const academicPlanIdToName = (id) => AcademicPlans.findDoc(id).name;

export const academicPlanNameToSlug = (name) => itemToSlugName(AcademicPlans.findDoc(name));

export const academicTermIdToName = (id) => AcademicTerms.toString(id, false);

export const academicTermToName = (term) => AcademicTerms.toString(term._id, false);

export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

export const academicTermNameToShortName = (name) => {
  const termNameYear = name.split(' ');
  let termName = '';
  switch (termNameYear[0]) {
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
  return `${termName} ${termNameYear[1]}`;
};

export const academicTermNameToSlug = (name) => itemToSlugName(AcademicTerms.getAcademicTermFromToString(name));

export const careerGoalIdToName = (id) => CareerGoals.findDoc(id).name;

export const careerGoalNameToSlug = (name) => itemToSlugName(CareerGoals.findDoc(name));

export const courseToName = (course) => `${course.num}: ${course.shortName}`;

export const courseNameToCourseDoc = (name) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

export const courseNameToSlug = (name) => itemToSlugName(Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) }));

export const courseSlugToName = (slug) => courseToName(Courses.findDoc(Slugs.getEntityID(slug, 'Course')));

export const degreeShortNameToSlug = (shortName) => itemToSlugName(DesiredDegrees.findDoc({ shortName }));

export const docToName = (doc: IHasName) => doc.name;

export const docToSlugNameAndType = (doc: IHasSlugID) => `${Slugs.findDoc(doc.slugID).name} (${Slugs.findDoc(doc.slugID).entityName})`;

export const docToShortName = (doc) => doc.shortName;

export const docToShortDescription = (doc) => {
  let description = doc.description;
  if (description.length > 200) {
    description = `${description.substring(0, 200)}`;
    if (description.charAt(description.length - 1) === ' ') {
      description = `${description.substring(0, 199)}`;
    }
  }
  return description;
};

export const interestIdToName = (id) => Interests.findDoc(id).name;

export const interestNameToId = (name) => Interests.findDoc(name)._id;

export const interestNameToSlug = (name) => itemToSlugName(Interests.findDoc(name));

export const interestTypeNameToSlug = (name) => itemToSlugName(InterestTypes.findDoc(name));

export const interestTypeNameToId = (name) => InterestTypes.findDoc(name)._id;

export const mentorQuestionToSlug = (question) => itemToSlugName(MentorQuestions.findDoc({ question }));

export const opportunityIdToName = (id) => Opportunities.findDoc(id).name;

export const opportunityNameToSlug = (name) => itemToSlugName(Opportunities.findDoc(name));

export const opportunityTerms = (opportuntiy) => {
  const academicTermIDs = opportuntiy.termIDs;
  const upcomingAcademicTerms = _.filter(academicTermIDs, (termID) => AcademicTerms.isUpcomingTerm(termID));
  return _.map(upcomingAcademicTerms, (termID) => AcademicTerms.toString(termID));
};

export const opportunityTermsNotTaken = (opportunity, studentID) => {
  const termIDs = opportunity.termIDs;
  const takenTermIDs = [];
  const termNames = [];
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const ois = OpportunityInstances.findNonRetired({ studentID, opportunityID: opportunity._id });
  _.forEach(ois, (o) => {
    takenTermIDs.push(o.termID);
  });
  _.forEach(termIDs, (termID) => {
    if (AcademicTerms.findDoc(termID).termNumber >= currentTerm.termNumber) {
      if (!_.includes(takenTermIDs, termID)) {
        termNames.push(AcademicTerms.toString(termID));
      }
    }
  });
  return termNames.slice(0, 8);
};

export const unverifiedOpportunityTermNames = (opportunity, studentID) => {
  const termNames = [];
  const ois = OpportunityInstances.findNonRetired({ studentID, opportunityID: opportunity._id });
  _.forEach(ois, (o) => {
    if (!o.verified) {
      termNames.push(AcademicTerms.toString(o.termID, false));
    }
  });
  return termNames;
};

export const opportunityInstanceToName = (oi) => {
  const student = StudentProfiles.findDoc({ userID: oi.studentID }).username;
  const opportunity = Opportunities.findDoc(oi.opportunityID).name;
  const term = AcademicTerms.toString(oi.termID, false);
  return `${student}-${opportunity}-${term}`;
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

export const profileGetFavoriteAcademicPlans = (profile) => {
  const studentID = profile.userID;
  const favPlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  return _.map(favPlans, (fav) => AcademicPlans.findDoc(fav.academicPlanID));
};

export const profileGetFavoriteAcademicPlanIDs = (profile) => _.map(profileGetFavoriteAcademicPlans(profile), (plan) => plan._id);

export const profileGetCareerGoals = (profile) => {
  const userID = profile.userID;
  const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
  return _.map(favCareerGoals, (fav) => CareerGoals.findDoc(fav.careerGoalID));
};

export const profileGetCareerGoalIDs = (profile) => _.map(profileGetCareerGoals(profile), (goal) => goal._id);

export const profileGetDesiredDegreeName = (profile) => {
  if (profile.academicPlanID) {
    return docToName(AcademicPlans.findDoc(profile.academicPlanID));
  }
  return 'Not yet specified.';
};

export const profileGetInterests = (profile) => {
  const userID = profile.userID;
  const favInterests = FavoriteInterests.findNonRetired({ userID });
  return _.map(favInterests, (fav) => Interests.findDoc(fav.interestID));
};

export const profileGetInterestIDs = (profile) => _.map(profileGetInterests(profile), (interest) => interest._id);

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

export const studentsParticipating = (item) => {
  const participatingUsers = StudentParticipations.findDoc({ itemID: item._id });
  return participatingUsers.itemCount;
};

export const userIdToName = (userID) => {
  const profile = Users.getProfile(userID);
  return `${Users.getFullName(userID)} (${profile.username})`;
};

export const userToFullName = (user) => Users.getFullName(user);

export const userToPicture = (user) => {
  const picture = Users.getProfile(user).picture;
  return picture || defaultProfilePicture;
};
