import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
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
    interestIDs?: string[];
  };
  type: string;
  cardLinkName: string;
}

// TODO Why is this called ProfileCard? We used to store information about interests, career goals and academic plans in the Profile. We've moved them to the Profile*Collections.

const ProfileCard: React.FC<ProfileCardProps> = ({ item, type, cardLinkName }) => {
  const match = useRouteMatch();
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const slugName = itemToSlugName(item);
  // console.log(interested);
  // @ts-ignore
  return (
    <Card>
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml source={`${itemShortDescription}...`}
                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        { item.interestIDs ? (<InterestList item={item} size="small" />) : ''}
      </Card.Content>
      <Link to={buildExplorerSlugRoute(match, type, slugName)} className="ui button">
        <Icon name="zoom-in" />
          &nbsp; {cardLinkName || 'View More'}
      </Link>
    </Card>
  );
};

export default ProfileCard;
