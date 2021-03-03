import { PROFILE_ENTRY_TYPE, IFavoriteTypes } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
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
  UserInteractionDefine,
} from '../../../../../../typings/radgrad';
import { Users } from '../../../../../../api/user/UserCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { UserInteractionsTypes } from '../../../../../../api/analytic/UserInteractionsTypes';

export const getCollectionName = (type: IFavoriteTypes): string => {
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
      console.error(`Bad favorite type: ${type}`);
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

export const createDefinitionData = (studentID: string, item: ItemType, type: IFavoriteTypes): ProfileCareerGoalDefine | ProfileCourseDefine | ProfileInterestDefine | ProfileOpportunityDefine => {
  const student = getStudent(studentID);
  const slug = getSlug(item.slugID);
  let definitionData;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      definitionData = {
        username: student,
        careerGoal: slug,
      };
      break;
    case PROFILE_ENTRY_TYPE.COURSE:
      definitionData = {
        student,
        course: slug,
      };
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      definitionData = {
        username: student,
        interest: slug,
      };
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      definitionData = {
        student,
        opportunity: slug,
      };
      break;
    default:
      console.error(`Bad favorite type: ${type}`);
      break;
  }
  return definitionData;
};

export const createInteractionData = (studentID: string, item: ItemType, type: IFavoriteTypes, favorite: boolean): UserInteractionDefine => {
  const student = getStudent(studentID);
  const slug = getSlug(item.slugID);
  let interactionData: UserInteractionDefine;
  const interactionType = favorite ? UserInteractionsTypes.FAVORITEITEM : UserInteractionsTypes.UNFAVORITEITEM;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      interactionData = {
        username: student,
        type: interactionType,
        typeData: [type, slug],
      };
      break;
    case PROFILE_ENTRY_TYPE.COURSE:
      interactionData = {
        username: student,
        type: interactionType,
        typeData: [type, slug],
      };
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      interactionData = {
        username: student,
        type: interactionType,
        typeData: [type, slug],
      };
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      interactionData = {
        username: student,
        type: interactionType,
        typeData: [type, slug],
      };
      break;
    default:
      console.error(`Bad favorite type: ${type}`);
      break;
  }
  return interactionData;
};
