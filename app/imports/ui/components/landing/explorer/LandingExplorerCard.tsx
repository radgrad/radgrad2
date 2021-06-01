import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../../shared/utilities/router';
import { docToName, docToShortDescription, itemToSlugName } from '../../shared/utilities/data-model';
import LandingInterestList from '../LandingInterestList';

interface LandingExplorerCardProps {
  item: {
    _id: string;
    name: string;
    interestIDs?: string[];
    termIDs?:string[];
    num?:string;
  };
  type: string;
}

const LandingExplorerCard: React.FC<LandingExplorerCardProps> = ({ item, type }) => {
  const match = useRouteMatch();
  const slugName = itemToSlugName(item);
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/${type}/${slugName}`;
  const itemName = (type === EXPLORER_TYPE.COURSES) ? `${item.name} (${item.num})` : docToName(item);
  const itemShortDescription = docToShortDescription(item);
  return (
    <Card>
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml source={`${itemShortDescription}...`} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        { item.interestIDs ? (<LandingInterestList interestIDs={item.interestIDs} size="small" />) : ''}
      </Card.Content>
      <Button.Group attached="bottom" className="radgrad-home-buttons ui center aligned three bottom attached {{hidden}} buttons">
        <a href={routeToItem} className="ui button">
          <Icon name="zoom in" />
          See Details
        </a>
      </Button.Group>
    </Card>
  );
};

export default LandingExplorerCard;
