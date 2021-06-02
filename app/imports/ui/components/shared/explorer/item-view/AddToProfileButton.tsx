import React from 'react';
import { Button, Icon, SemanticFLOATS } from 'semantic-ui-react';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { CareerGoal, Course, Interest, MeteorError, Opportunity } from '../../../../../typings/radgrad';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../../../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { PROFILE_ENTRY_TYPE, IProfileEntryTypes } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import { createDefinitionData, getCollectionName } from './utilities/profile-button';

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
  defineMethod.callPromise({ collectionName, definitionData })
    .catch((error: MeteorError) => { RadGradAlert.failure('Failed to add to profile', error.message, error);})
    .then(() => { RadGradAlert.success('Added to profile');});
};

const handleRemove = (studentID: string, item: ItemType, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
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
  removeItMethod.callPromise({ collectionName, instance })
    .catch((error) => { RadGradAlert.failure('Failed to remove from profile', error.message, error);});
};

const AddToProfileButton: React.FC<AddToProfileButtonProps> = ({ studentID, item, type, added, inverted, floated }) => (
  <React.Fragment>
    {added ? (
      <Button id={COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON} onClick={handleRemove(studentID, item, type)} size="small" color="teal" floated={floated || 'right'} basic inverted={inverted}>
        <Icon name="user outline" color="grey" inverted={inverted} />
        <Icon name="minus" />
        REMOVE FROM PROFILE
      </Button>
    ) : (
      <Button id={COMPONENTIDS.ADD_TO_PROFILE_BUTTON} size="small" onClick={handleAdd(studentID, item, type)} color="teal" floated={floated || 'right'} basic inverted={inverted}>
        <Icon name="user" color="grey" inverted={inverted} />
        <Icon name="plus" />
        ADD TO PROFILE
      </Button>
    )}
  </React.Fragment>
);

export default AddToProfileButton;
