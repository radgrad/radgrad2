import React from 'react';
import { Button, Icon, SemanticFLOATS } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { CareerGoal, Course, Interest, MeteorError, Opportunity } from '../../../../../typings/radgrad';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../../../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../../../api/analytic/UserInteractionCollection.methods';
import { PROFILE_ENTRY_TYPE, IProfileEntryTypes } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { createDefinitionData, createInteractionData, getCollectionName } from './utilities/profile-button';

type ItemType = CareerGoal | Course | Interest | Opportunity;
export interface AddToProfileButtonProps {
  item: ItemType;
  studentID: string;
  type: IProfileEntryTypes;
  added: boolean;
  inverted: boolean;
  floated?: SemanticFLOATS;
}

const handleAdd = (studentID: string, item: ItemType, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
  const definitionData = createDefinitionData(studentID, item, type);
  const interactionData = createInteractionData(studentID, item, type, true);

  defineMethod.call({ collectionName, definitionData }, (error: MeteorError) => {
    if (error) {
      Swal.fire({
        title: 'Failed to add to profile',
        icon: 'error',
        text: error.message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } else {
      Swal.fire({
        title: 'Added to profile',
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

const handleRemove = (studentID: string, item: ItemType, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
  const interactionData = createInteractionData(studentID, item, type, false);
  let instance;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      instance = ProfileCareerGoals.findNonRetired({
        userID: studentID,
        careerGoalID: item._id,
      })[0]._id;
      break;
    case PROFILE_ENTRY_TYPE.COURSE:
      instance = ProfileCourses.findNonRetired({
        studentID,
        courseID: item._id,
      })[0]._id;
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      instance = ProfileInterests.findNonRetired({
        userID: studentID,
        interestID: item._id,
      })[0]._id;
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      instance = ProfileOpportunities.findNonRetired({
        studentID,
        opportunityID: item._id,
      })[0]._id;
      break;
    default:
      console.error(`Bad profile entry type: ${type}`);
      break;
  }

  removeItMethod.call({ collectionName, instance }, (error: MeteorError) => {
    if (error) {
      Swal.fire({
        title: 'Failed to remove from profile',
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

const AddToProfileButton: React.FC<AddToProfileButtonProps> = ({ studentID, item, type, added, inverted, floated }) => (
  <React.Fragment>
    {added ? (
      <Button onClick={handleRemove(studentID, item, type)} size="small" color="teal" floated={floated || 'right'} basic inverted={inverted}>
        <Icon name="user outline" color="grey" inverted={inverted} />
        <Icon name="minus" />
        REMOVE FROM PROFILE
      </Button>
    ) : (
      <Button size="small" onClick={handleAdd(studentID, item, type)} color="teal" floated={floated || 'right'} basic inverted={inverted}>
        <Icon name="user" color="grey" inverted={inverted}/>
        <Icon name="plus" />
        ADD TO PROFILE
      </Button>
    )}
  </React.Fragment>
);

export default AddToProfileButton;
