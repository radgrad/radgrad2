import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  IAcademicPlan,
  IBaseProfile,
  ICareerGoal,
  ICourse,
  IFavoriteAcademicPlan,
  IFavoriteCareerGoal,
  IFavoriteCourse,
  IFavoriteInterest,
  IFavoriteOpportunity,
  IInterest,
  IMeteorError,
  IOpportunity,
} from '../../../typings/radgrad';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { FAVORITE_TYPE, IFavoriteTypes } from '../../../api/favorite/FavoriteTypes';

interface IFavoriteButtonProps {
  item: IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;
  studentID: string;
  type: IFavoriteTypes;
  added: boolean;
}

const getCollectionName = (type: IFavoriteTypes): string => {
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

const getStudent = (studentID: string): string => {
  const profile: IBaseProfile = Users.getProfile(studentID);
  return profile.username;
};

const getSlug = (slugID: string): string => Slugs.getNameFromID(slugID);

const createDefinitionData = (props: IFavoriteButtonProps): IFavoriteAcademicPlan | IFavoriteCareerGoal | IFavoriteCourse | IFavoriteInterest | IFavoriteOpportunity => {
  const student = getStudent(props.studentID);
  const slug = getSlug(props.item.slugID);
  let definitionData;
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      definitionData = {
        student,
        academicPlan: slug,
        retired: false,
      };
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      definitionData = {
        username: student,
        careerGoal: slug,
        retired: false,
      };
      break;
    case FAVORITE_TYPE.COURSE:
      definitionData = {
        student,
        course: slug,
        retired: false,
      };
      break;
    case FAVORITE_TYPE.INTEREST:
      definitionData = {
        username: student,
        interest: slug,
        retired: false,
      };
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      definitionData = {
        student,
        opportunity: slug,
        retired: false,
      };
      break;
    default:
      console.error(`Bad favorite type: ${props.type}`);
      break;
  }
  return definitionData;
};

const createInteractionData = (props: IFavoriteButtonProps, favorite: boolean): UserInteractionsDataType => {
  const student = getStudent(props.studentID);
  const slug = getSlug(props.item.slugID);
  let interactionData: UserInteractionsDataType;
  const type = favorite ? UserInteractionsTypes.FAVORITEITEM : UserInteractionsTypes.UNFAVORITEITEM;
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      interactionData = {
        username: student,
        type,
        typeData: `${props.type}:${slug}`,
      };
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      interactionData = {
        username: student,
        type,
        typeData: `${props.type}:${slug}`,
      };
      break;
    case FAVORITE_TYPE.COURSE:
      interactionData = {
        username: student,
        type,
        typeData: `${props.type}:${slug}`,
      };
      break;
    case FAVORITE_TYPE.INTEREST:
      interactionData = {
        username: student,
        type,
        typeData: `${props.type}:${slug}`,
      };
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      interactionData = {
        username: student,
        type,
        typeData: `${props.type}:${slug}`,
      };
      break;
    default:
      console.error(`Bad favorite type: ${props.type}`);
      break;
  }
  return interactionData;
};

const handleAdd = (props: IFavoriteButtonProps) => () => {
  const collectionName = getCollectionName(props.type);
  const definitionData = createDefinitionData(props);
  const interactionData = createInteractionData(props, true);

  defineMethod.call({ collectionName, definitionData }, (error: IMeteorError) => {
    if (error) {
      Swal.fire({
        title: 'Failed to Favorite',
        icon: 'error',
        text: error.message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } else {
      Swal.fire({
        title: 'Favorited',
        icon: 'success',
      });
      userInteractionDefineMethod.call(interactionData, (userInteractionError: IMeteorError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });

      // Page Interests

    }
  });
};

const handleRemove = (props: IFavoriteButtonProps) => () => {
  const collectionName = getCollectionName(props.type);
  const interactionData = createInteractionData(props, false);
  let instance;
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      instance = FavoriteAcademicPlans.findNonRetired({
        studentID: props.studentID,
        academicPlanID: props.item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      instance = FavoriteCareerGoals.findNonRetired({
        userID: props.studentID,
        careerGoalID: props.item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.COURSE:
      instance = FavoriteCourses.findNonRetired({
        studentID: props.studentID,
        courseID: props.item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.INTEREST:
      instance = FavoriteInterests.findNonRetired({
        userID: props.studentID,
        interestID: props.item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.OPPORTUNITY: // opportunity
      instance = FavoriteOpportunities.findNonRetired({
        studentID: props.studentID,
        opportunityID: props.item._id,
      })[0]._id;
      break;
    default:
      console.error(`Bad favorite type: ${props.type}`);
      break;
  }

  removeItMethod.call({ collectionName, instance }, (error: IMeteorError) => {
    if (error) {
      Swal.fire({
        title: 'Failed to Unfavorite',
        icon: 'error',
        text: error.message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  });
  userInteractionDefineMethod.call(interactionData, (userInteractionError: IMeteorError) => {
    if (userInteractionError) {
      console.error('Error creating UserInteraction.', userInteractionError);
    }
  });
};

const FavoritesButton = (props: IFavoriteButtonProps) => (
  <React.Fragment>
    {props.added ?
      (
        <Button onClick={handleRemove(props)} size="mini" color="green" floated="right" basic>
          <Icon
            name="heart outline"
            color="red"
          />
          <Icon name="minus" />
          REMOVE FROM FAVORITES
        </Button>
      )
      :
      (
        <Button size="mini" onClick={handleAdd(props)} color="green" floated="right" basic>
          <Icon
            name="heart"
            color="red"
          />
          <Icon
            name="plus"
          />
          ADD TO FAVORITES
        </Button>
      )}
  </React.Fragment>
);

export default withRouter(withTracker((props) => {
  const count = FavoriteAcademicPlans.findNonRetired({
      studentID: props.studentID,
      academicPlanID: props.item._id,
    }).length +
    FavoriteCareerGoals.findNonRetired({ userID: props.studentID, careerGoalID: props.item._id }).length +
    FavoriteCourses.findNonRetired({ studentID: props.studentID, courseID: props.item._id }).length +
    FavoriteInterests.findNonRetired({ userID: props.studentID, interestID: props.item._id }).length +
    FavoriteOpportunities.findNonRetired({ studentID: props.studentID, opportunityID: props.item._id }).length;
  return {
    added: count > 0,
  };
})(FavoritesButton));
