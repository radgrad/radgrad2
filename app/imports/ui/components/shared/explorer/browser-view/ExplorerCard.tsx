import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon, Label, Button } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { ProfileCourses } from '../../../../../api/user/profile-entries/ProfileCourseCollection';
import { IProfileEntryTypes, PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { CareerGoal, Course, Interest, MeteorError, Opportunity } from '../../../../../typings/radgrad';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import * as Router from '../../utilities/router';
import { docToName, docToShortDescription, itemToSlugName } from '../../utilities/data-model';
import { buildExplorerSlugRoute } from '../../utilities/router';
import InterestList from '../../InterestList';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';
import { Courses } from '../../../../../api/course/CourseCollection';
import { createDefinitionData, getCollectionName } from '../item-view/utilities/profile-button';

interface ExplorerCardProps {
  item: {
    _id: string;
    name: string;
    interestIDs: string[];
    termIDs?:string[];
    slugID: string,
    num?:string,
    createdAt: Date,
    updatedAt?: Date;
  };
  type: string;
  inProfile: boolean;
}
type ItemType = CareerGoal | Course | Interest | Opportunity;

const handleAdd = (userID: string, item: ItemType, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
  const definitionData = createDefinitionData(userID, item, type);
  defineMethod.callPromise({ collectionName, definitionData })
    .catch((error: MeteorError) => { RadGradAlert.failure('Failed to add to profile', error.message);})
    .then(() => { RadGradAlert.success('Added to profile');});
};

const handleRemove = (userID: string, item: ItemType, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
  let instance;
  switch (type) {
    case PROFILE_ENTRY_TYPE.COURSE:
      instance = ProfileCourses.findNonRetired({
        userID,
        courseID: item._id,
      })[0]._id;
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      instance = ProfileInterests.findNonRetired({
        userID,
        interestID: item._id,
      })[0]._id;
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      instance = ProfileOpportunities.findNonRetired({
        userID,
        opportunityID: item._id,
      })[0]._id;
      break;
    // TODO add internships.
    default:
      console.error(`Bad profile entry type: ${type}`);
      break;
  }
  removeItMethod.callPromise({ collectionName, instance })
    .catch((error) => { RadGradAlert.failure('Failed to remove from profile', error.message, error);});
};

const ExplorerCard: React.FC<ExplorerCardProps> = ({ item, type, inProfile }) => {
  const match = useRouteMatch();
  const itemName = (type === EXPLORER_TYPE.COURSES) ? Courses.getName(item._id) : docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const slugName = itemToSlugName(item);
  const userID = match.userID;
  return (
    <Card>
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
        { inProfile ? <Label ribbon='right' color='green'>IN MY PROFILE</Label> : '' }
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml source={itemShortDescription}
          renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        { item.interestIDs ? (<InterestList item={item} size="small" />) : ''}
      </Card.Content>
      <Button.Group>
        <Link to={buildExplorerSlugRoute(match, type, slugName)} className="ui button" id={`see-details-${slugName}-button`}>
          <Icon name="zoom in" />
          See Details
        </Link>
        <Button.Or />
        {inProfile ? (<Button onClick={handleRemove(userID, item, type)}>Remove Profile</Button>) : <Button onClick={handleAdd(userID, item, type)}>Add To Profile</Button>}
      </Button.Group>
    </Card>
  );
};

export default ExplorerCard;
