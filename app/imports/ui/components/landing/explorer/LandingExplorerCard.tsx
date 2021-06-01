import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getSlug } from '../utilities/helper-functions';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../../shared/utilities/router';
import { docToShortDescription } from '../../shared/utilities/data-model';
import LandingInterestList from '../LandingInterestList';
import { Courses } from '../../../../api/course/CourseCollection';

interface ItemProps {
  name: string;
  num?: string;
  description: string;
  interestIDs?: string[];
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
  const itemShortDescription = docToShortDescription(item);
  return (
    <Card>
      <Card.Content className="content">
        <div className="header">{title}</div>
      </Card.Content>
      <Card.Content className="content">
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
