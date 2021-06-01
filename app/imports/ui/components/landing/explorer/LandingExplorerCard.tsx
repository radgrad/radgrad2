import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getSlug, itemShortDescription } from '../utilities/helper-functions';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../../shared/utilities/router';
import { Courses } from '../../../../api/course/CourseCollection';

interface ItemProps {
  name: string;
  num?: string;
  description: string;
  slugID: string;
}

interface LandingExplorerCardProps {
  item: ItemProps;
  type: string;
}

const LandingExplorerCard: React.FC<LandingExplorerCardProps> = ({ item, type }) => {
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/${type}/${getSlug(item)}`;
  let title = item.name;
  if (type === EXPLORER_TYPE.COURSES) {
    title = Courses.getName(getSlug(item));
  }
  const match = useRouteMatch();
  return (
    <Card>
      <Card.Content className="content">
        <div className="header">{title}</div>
      </Card.Content>
      <Card.Content className="content">
        <Markdown escapeHtml source={`${itemShortDescription(item)}...`} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
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

export default LandingExplorerCard;
