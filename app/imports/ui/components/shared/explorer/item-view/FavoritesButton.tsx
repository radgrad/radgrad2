import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import {
  AcademicPlan,
  CareerGoal,
  Course,
  Interest,
  MeteorError,
  Opportunity,
  PageInterestDefine,
} from '../../../../../typings/radgrad';
import { FavoriteCareerGoals } from '../../../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../../../api/favorite/FavoriteOpportunityCollection';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../../../api/analytic/UserInteractionCollection.methods';
import { FAVORITE_TYPE, IFavoriteTypes } from '../../../../../api/favorite/FavoriteTypes';
import { pageInterestDefineMethod } from '../../../../../api/page-tracking/PageInterestCollection.methods';
import {
  createDefinitionData,
  createInteractionData,
  createPageInterestData,
  getCollectionName,
} from './utilities/favorites-button';
import { Users } from '../../../../../api/user/UserCollection';
import { ROLE } from '../../../../../api/role/Role';

export interface FavoriteButtonProps {
  item: AcademicPlan | CareerGoal | Course | Interest | Opportunity;
  studentID: string;
  type: IFavoriteTypes;
  added: boolean;
}

const handleAdd = (studentID: string, item: AcademicPlan | CareerGoal | Course | Interest | Opportunity, type: IFavoriteTypes) => () => {
  const collectionName = getCollectionName(type);
  const definitionData = createDefinitionData(studentID, item, type);
  const interactionData = createInteractionData(studentID, item, type, true);

  defineMethod.call({ collectionName, definitionData }, (error: MeteorError) => {
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
      userInteractionDefineMethod.call(interactionData, (userInteractionError: MeteorError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
      const isStudent = Users.getProfile(studentID).role === ROLE.STUDENT;
      if (isStudent) {
        const pageInterestData: PageInterestDefine = createPageInterestData(studentID, item, type);
        pageInterestDefineMethod.call(pageInterestData, (pageInterestError) => {
          if (pageInterestError) {
            console.error('Error creating PageInterest.', pageInterestError);
          }
        });
      }
    }
  });
};

const handleRemove = (studentID: string, item: AcademicPlan | CareerGoal | Course | Interest | Opportunity, type: IFavoriteTypes) => () => {
  const collectionName = getCollectionName(type);
  const interactionData = createInteractionData(studentID, item, type, false);
  let instance;
  switch (type) {
    case FAVORITE_TYPE.CAREERGOAL:
      instance = FavoriteCareerGoals.findNonRetired({
        userID: studentID,
        careerGoalID: item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.COURSE:
      instance = FavoriteCourses.findNonRetired({
        studentID,
        courseID: item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.INTEREST:
      instance = FavoriteInterests.findNonRetired({
        userID: studentID,
        interestID: item._id,
      })[0]._id;
      break;
    case FAVORITE_TYPE.OPPORTUNITY:
      instance = FavoriteOpportunities.findNonRetired({
        studentID,
        opportunityID: item._id,
      })[0]._id;
      break;
    default:
      console.error(`Bad favorite type: ${type}`);
      break;
  }

  removeItMethod.call({ collectionName, instance }, (error: MeteorError) => {
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
  userInteractionDefineMethod.call(interactionData, (userInteractionError: MeteorError) => {
    if (userInteractionError) {
      console.error('Error creating UserInteraction.', userInteractionError);
    }
  });
};

const FavoritesButton: React.FC<FavoriteButtonProps> = ({ studentID, item, type, added }) => (
  <React.Fragment>
    {added ?
      (
        <Button onClick={handleRemove(studentID, item, type)} size="mini" color="green" floated="right" basic>
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
        <Button size="mini" onClick={handleAdd(studentID, item, type)} color="green" floated="right" basic>
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

export default FavoritesButton;
