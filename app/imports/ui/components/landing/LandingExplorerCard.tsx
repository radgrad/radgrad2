import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getSlug, itemShortDescription } from './helper-functions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import * as Router from '../shared/RouterHelperFunctions';

interface IItemProps {
  name: string;
  num?: string;
  description: string;
  slugID: string;
}

interface ILandingExplorerCardProps {
  item: IItemProps;
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const LandingExplorerCard = (props: ILandingExplorerCardProps) => {
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/${props.type}/${getSlug(props.item)}`;
  let title = props.item.name;
  if (props.type === EXPLORER_TYPE.COURSES) {
    title = `${title} (${props.item.num})`;
  }
  const { match } = props;
  return (
    <Card className="ui card radgrad-interest-card">
      <Card.Content className="content">
        <div className="header">{title}</div>
      </Card.Content>
      <Card.Content className="content">
        <Markdown
          escapeHtml
          source={`${itemShortDescription(props.item)}...`}
          renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
        />
      </Card.Content>
      <Button.Group attached="bottom" className="radgrad-home-buttons ui center aligned three bottom attached {{hidden}} buttons">
        <a href={routeToItem} className="ui button">
          <Icon name="chevron circle right" />
          <br />
          View More
        </a>
      </Button.Group>
    </Card>
  );
};

const LandingExplorerCardContainer = withRouter(LandingExplorerCard);
export default LandingExplorerCardContainer;
