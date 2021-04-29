import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon, Label } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import * as Router from '../../utilities/router';
import {
  docToName,
  docToShortDescription,
  itemToSlugName,
} from '../../utilities/data-model';
import { buildExplorerSlugRoute } from '../../utilities/router';
import InterestList from '../../InterestList';

interface ProfileCardProps {
  item: {
    _id: string;
    name: string;
    interestIDs: string[];
  };
  type: string;
  inProfile: boolean;
}

// TODO Why is this called ProfileCard? We used to store information about interests, career goals and academic plans in the Profile. We've moved them to the Profile*Collections.

const ProfileCard: React.FC<ProfileCardProps> = ({ item, type, inProfile }) => {
  const match = useRouteMatch();
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const slugName = itemToSlugName(item);
  // console.log(interested);
  return (
    <Card>
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
        { inProfile ? <Label ribbon='right' color='green'>IN MY PROFILE</Label> : '' }
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml source={`${itemShortDescription}...`}
                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        { item.interestIDs ? (<InterestList item={item} size="small" />) : ''}
      </Card.Content>
      <Link to={buildExplorerSlugRoute(match, type, slugName)} className="ui button">
        <Icon name="zoom-in" />
          &nbsp; {inProfile ? 'See Details / Remove from Profile' : 'See Details / Add to Profile' || 'View More'}
      </Link>
    </Card>
  );
};

export default ProfileCard;
