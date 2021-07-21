import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon, Label, Button } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import * as Router from '../../utilities/router';
import { docToName, docToShortDescription, itemToSlugName } from '../../utilities/data-model';
import { buildExplorerSlugRoute } from '../../utilities/router';
import InterestList from '../../InterestList';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';
import { Courses } from '../../../../../api/course/CourseCollection';
import AddToProfileButton from '../item-view/AddToProfileButton';

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

const ExplorerCard: React.FC<ExplorerCardProps> = ({ item, type, inProfile }) => {
  const match = useRouteMatch();
  const itemName = (type === EXPLORER_TYPE.COURSES) ? Courses.getName(item._id) : docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const slugName = itemToSlugName(item);
  const addRemoveButton = <AddToProfileButton type={match.type} userID={match.userID} item={match}
    added={inProfile} floated="left"  inverted/>;
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
        <Button>{inProfile ? 'Remove Profile' : 'Add to Profile' || 'View More'}</Button>
      </Button.Group>
      <Button.Group>
        <Link to={buildExplorerSlugRoute(match, type, slugName)} className="ui button" id={`see-details-${slugName}-button`}>
          <Icon name="zoom in" />
          See Details
        </Link>
        <Button.Or />
        <Button><AddToProfileButton type={match.type} userID={match.userID} item={match}
          added={inProfile} floated="left" /></Button>
      </Button.Group>
      <Link to={buildExplorerSlugRoute(match, type, slugName)} className="ui button" id={`see-details-${slugName}-button`}>
        <Icon name="zoom in" />
          &nbsp; {inProfile ? 'See Details / Remove from Profile' : 'See Details / Add to Profile' || 'View More'}
      </Link>
    </Card>
  );
};

export default ExplorerCard;
