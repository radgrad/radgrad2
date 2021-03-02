import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { CareerGoal, Course, Interest, MeteorError, Opportunity } from '../../../../../typings/radgrad';
import { FavoriteCareerGoals } from '../../../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../../../api/favorite/FavoriteOpportunityCollection';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../../../api/analytic/UserInteractionCollection.methods';
import { FAVORITE_TYPE, IFavoriteTypes } from '../../../../../api/favorite/FavoriteTypes';
import { createDefinitionData, createInteractionData, getCollectionName } from './utilities/favorites-button';

type ItemType = CareerGoal | Course | Interest | Opportunity;
export interface FavoriteButtonProps {
  item: ItemType;
  studentID: string;
  type: IFavoriteTypes;
  added: boolean;
}

const handleAdd = (studentID: string, item: ItemType, type: IFavoriteTypes) => () => {
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
    }
  });
};

const handleRemove = (studentID: string, item: ItemType, type: IFavoriteTypes) => () => {
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
    {added ? (
      <Button onClick={handleRemove(studentID, item, type)} size="mini" color="green" floated="right" basic>
        <Icon name="heart outline" color="red" />
        <Icon name="minus" />
        REMOVE FROM PROFILE
      </Button>
    ) : (
      <Button size="mini" onClick={handleAdd(studentID, item, type)} color="green" floated="right" basic>
        <Icon name="heart" color="red" />
        <Icon name="plus" />
        ADD TO PROFILE
      </Button>
    )}
  </React.Fragment>
);

export default FavoritesButton;
