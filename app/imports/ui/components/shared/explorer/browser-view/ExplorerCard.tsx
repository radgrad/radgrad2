import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon, Label, Button } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import * as Router from '../../utilities/router';
import { docToName, docToShortDescription, itemToSlugName } from '../../utilities/data-model';
import { buildExplorerSlugRoute } from '../../utilities/router';
import InterestList from '../../InterestList';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';
import { Courses } from '../../../../../api/course/CourseCollection';


type ItemType = CareerGoal | Course | Interest | Opportunity;

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
  explorerType?: EXPLORER_TYPE;
}



const ExplorerCard: React.FC<ExplorerCardProps> = ({ item, type, inProfile, explorerType }) => {
  const match = useRouteMatch();
  const itemName = (type === EXPLORER_TYPE.COURSES) ? Courses.getName(item._id) : docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const slugName = itemToSlugName(item);
  const userID = match.userID;
  let itemType;
  switch (explorerType) {
    case EXPLORER_TYPE.INTERESTS:
      itemType = PROFILE_ENTRY_TYPE.INTEREST;
      break;

  }
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
        {inProfile ? (<Button>Remove Profile</Button>) : <Button>Add To Profile</Button>}
      </Button.Group>
    </Card>
  );
};

export default ExplorerCard;
