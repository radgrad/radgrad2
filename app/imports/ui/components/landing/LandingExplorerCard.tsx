import * as React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getSlug, itemShortDescription } from './helper-functions';

interface IItemProps {
  name: string;
  description: string;
  slugID: string;
}

interface ILandingExplorerCardProps {
  item: IItemProps;
  type: string;
}

const LandingExplorerCard = (props: ILandingExplorerCardProps) => {
  const routeToItem = `#/explorer/${props.type}/${getSlug(props.item)}`;
  return (
    <Card className="ui card radgrad-interest-card">
      <Card.Content className="content">
        <div className="header">{props.item.name}</div>
      </Card.Content>
      <Card.Content className="content">
        <p>{itemShortDescription(props.item)}...</p>
      </Card.Content>
      <Button.Group attached="bottom" className="radgrad-home-buttons ui center aligned three bottom attached {{hidden}} buttons">
        <a href={routeToItem} className="ui button"><Icon name="chevron circle right"/><br/>View More</a>
      </Button.Group>
    </Card>
  );
};

const LandingExplorerCardContainer = withRouter(LandingExplorerCard);
export default LandingExplorerCardContainer;
