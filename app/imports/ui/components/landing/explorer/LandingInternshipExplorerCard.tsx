import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../../shared/utilities/router';
import { docToShortDescription } from '../../shared/utilities/data-model';
import LandingInterestList from '../LandingInterestList';

interface ItemProps {
  position: string;
  description: string;
  guid?: string;
  _id: string;
  interestIDs: string[];
}

interface LandingInternshipExplorerCardProps {
  item: ItemProps;
  type: string;
}

const LandingInternshipExplorerCard: React.FC<LandingInternshipExplorerCardProps> = ({ item }) => {
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/internship/${item.guid}`;

  const match = useRouteMatch();
  const itemShortDescription = docToShortDescription(item);
  return (
    <Card>
      <Card.Content className="content">
        <div className="header">{item.position}</div>
      </Card.Content>
      <Card.Content className="content">
        <Markdown escapeHtml source={itemShortDescription} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
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

export default LandingInternshipExplorerCard;
