import { PROFILE_ENTRY_TYPE, IProfileEntryTypes } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import { ProfileCareerGoals } from '../../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../../../../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../../../../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import {
  BaseProfile, CareerGoal, Course,
  ProfileCareerGoalDefine,
  ProfileCourseDefine,
  ProfileInterestDefine,
  ProfileOpportunityDefine, Interest, Opportunity,
} from '../../../../../../typings/radgrad';
import { Users } from '../../../../../../api/user/UserCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';

export const getCollectionName = (type: IProfileEntryTypes): string => {
  let collectionName: string;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      collectionName = ProfileCareerGoals.getCollectionName();
      break;
    case PROFILE_ENTRY_TYPE.COURSE:
      collectionName = ProfileCourses.getCollectionName();
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      collectionName = ProfileInterests.getCollectionName();
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      collectionName = ProfileOpportunities.getCollectionName();
      break;
    default:
      console.error(`Bad profile entry type: ${type}`);
      break;
  }
  return collectionName;
};

export const getStudent = (studentID: string): string => {
  const profile: BaseProfile = Users.getProfile(studentID);
  return profile.username;
};

export const getSlug = (slugID: string): string => Slugs.getNameFromID(slugID);

type ItemType = CareerGoal | Course | Interest | Opportunity;

export const createDefinitionData = (studentID: string, item: ItemType, type: IProfileEntryTypes): ProfileCareerGoalDefine | ProfileCourseDefine | ProfileInterestDefine | ProfileOpportunityDefine => {
  const username = getStudent(studentID);
  const slug = getSlug(item.slugID);
  let definitionData;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      definitionData = {
        username,
        careerGoal: slug,
      };
      break;
    case PROFILE_ENTRY_TYPE.COURSE:
      definitionData = {
        username,
        course: slug,
      };
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      definitionData = {
        username,
        interest: slug,
      };
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      definitionData = {
        username,
        opportunity: slug,
      };
      break;
    default:
      console.error(`Bad profile entry type: ${type}`);
      break;
  }
  return definitionData;
};
