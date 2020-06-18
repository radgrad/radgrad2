import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IInterest,
  IMeteorError,
  IOpportunity,
  IPageInterest,
  IPageInterestDefine,
} from '../../../typings/radgrad';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { FAVORITE_TYPE, IFavoriteTypes } from '../../../api/favorite/FavoriteTypes';
import { PageInterests } from '../../../api/page-tracking/PageInterestCollection';
import { pageInterestDefineMethod } from '../../../api/page-tracking/PageInterestCollection.methods';
import {
  createDefinitionData,
  createInteractionData,
  createPageInterestData,
  getCollectionName,
} from './favorites-button-helper-functions';
import { getUsername, IMatchProps } from './RouterHelperFunctions';

export interface IFavoriteButtonProps {
  match: IMatchProps
  item: IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;
  studentID: string;
  type: IFavoriteTypes;
  added: boolean;
  pageInterest: IPageInterest;
}


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
        showConfirmButton: false,
        timer: 1500,
      });
      userInteractionDefineMethod.call(interactionData, (userInteractionError: IMeteorError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
      // Only define a PageInterest if there hasn't been one defined for the past 24 hours.
      if (!props.pageInterest) {
        const pageInterestData: IPageInterestDefine = createPageInterestData(props);
        pageInterestDefineMethod.call(pageInterestData, (pageInterestError) => {
          if (pageInterestError) {
            console.error('Error creating PageInterest.', pageInterestError);
          }
        });
      }
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

export default withRouter(withTracker((props: IFavoriteButtonProps) => {
  const count = FavoriteAcademicPlans.findNonRetired({
      studentID: props.studentID,
      academicPlanID: props.item._id,
    }).length +
    FavoriteCareerGoals.findNonRetired({ userID: props.studentID, careerGoalID: props.item._id }).length +
    FavoriteCourses.findNonRetired({ studentID: props.studentID, courseID: props.item._id }).length +
    FavoriteInterests.findNonRetired({ userID: props.studentID, interestID: props.item._id }).length +
    FavoriteOpportunities.findNonRetired({ studentID: props.studentID, opportunityID: props.item._id }).length;
  const username = getUsername(props.match);
  const slugName = Slugs.getNameFromID(props.item.slugID);
  const pageInterest: IPageInterest = PageInterests.findOne({ username, name: slugName });
  return {
    added: count > 0,
    pageInterest,
  };
})(FavoritesButton));
