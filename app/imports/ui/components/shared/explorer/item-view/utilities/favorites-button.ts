import { FAVORITE_TYPE, IFavoriteTypes } from '../../../../../../api/favorite/FavoriteTypes';
import { FavoriteAcademicPlans } from '../../../../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../../../../api/favorite/FavoriteOpportunityCollection';
import {
  BaseProfile,
  FavoriteAcademicPlanDefine,
  FavoriteCareerGoalDefine,
  FavoriteCourseDefine,
  FavoriteInterestDefine,
  FavoriteOpportunityDefine,
  PageInterestDefine,
  UserInteractionDefine,
} from '../../../../../../typings/radgrad';
import { Users } from '../../../../../../api/user/UserCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { UserInteractionsTypes } from '../../../../../../api/analytic/UserInteractionsTypes';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../../../../api/page-tracking/PageInterestsCategoryTypes';
import { FavoriteButtonProps } from '../FavoritesButton';

export const getCollectionName = (type: IFavoriteTypes): string => {
  let collectionName: string;
  switch (type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      collectionName = FavoriteAcademicPlans.getCollectionName();
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      collectionName = FavoriteCareerGoals.getCollectionName();
      break;
    case FAVORITE_TYPE.COURSE:
      collectionName = FavoriteCourses.getCollectionName();
      break;
    case FAVORITE_TYPE.INTEREST:
      collectionName = FavoriteInterests.getCollectionName();
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      collectionName = FavoriteOpportunities.getCollectionName();
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

export const createDefinitionData = (props: FavoriteButtonProps): FavoriteAcademicPlanDefine | FavoriteCareerGoalDefine | FavoriteCourseDefine | FavoriteInterestDefine | FavoriteOpportunityDefine => {
  const student = getStudent(props.studentID);
  const slug = getSlug(props.item.slugID);
  let definitionData;
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      definitionData = {
        student,
        academicPlan: slug,
      };
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      definitionData = {
        username: student,
        careerGoal: slug,
      };
      break;
    case FAVORITE_TYPE.COURSE:
      definitionData = {
        student,
        course: slug,
      };
      break;
    case FAVORITE_TYPE.INTEREST:
      definitionData = {
        username: student,
        interest: slug,
      };
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      definitionData = {
        student,
        opportunity: slug,
      };
      break;
    default:
      console.error(`Bad favorite type: ${props.type}`);
      break;
  }
  return definitionData;
};

export const createInteractionData = (props: FavoriteButtonProps, favorite: boolean): UserInteractionDefine => {
  const student = getStudent(props.studentID);
  const slug = getSlug(props.item.slugID);
  let interactionData: UserInteractionDefine;
  const type = favorite ? UserInteractionsTypes.FAVORITEITEM : UserInteractionsTypes.UNFAVORITEITEM;
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      interactionData = {
        username: student,
        type,
        typeData: [props.type, slug],
      };
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      interactionData = {
        username: student,
        type,
        typeData: [props.type, slug],
      };
      break;
    case FAVORITE_TYPE.COURSE:
      interactionData = {
        username: student,
        type,
        typeData: [props.type, slug],
      };
      break;
    case FAVORITE_TYPE.INTEREST:
      interactionData = {
        username: student,
        type,
        typeData: [props.type, slug],
      };
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      interactionData = {
        username: student,
        type,
        typeData: [props.type, slug],
      };
      break;
    default:
      console.error(`Bad favorite type: ${props.type}`);
      break;
  }
  return interactionData;
};

export const createPageInterestData = (props: FavoriteButtonProps): PageInterestDefine => {
  const username = getStudent(props.studentID);
  const name = Slugs.getNameFromID(props.item.slugID);
  let category: IPageInterestsCategoryTypes;
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      category = PageInterestsCategoryTypes.ACADEMIC_PLAN;
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      category = PageInterestsCategoryTypes.CAREERGOAL;
      break;
    case FAVORITE_TYPE.COURSE:
      category = PageInterestsCategoryTypes.COURSE;
      break;
    case FAVORITE_TYPE.INTEREST:
      category = PageInterestsCategoryTypes.INTEREST;
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      category = PageInterestsCategoryTypes.OPPORTUNITY;
      break;
    default:
      console.error(`Bad favorite type: ${props.type}`);
      break;
  }
  return { username, category, name };
};
