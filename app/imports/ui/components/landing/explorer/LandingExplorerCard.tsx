import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getSlug } from '../utilities/helper-functions';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../../shared/utilities/router';
import { docToName, docToShortDescription } from '../../shared/utilities/data-model';
import LandingInterestList from '../LandingInterestList';
import { Courses } from '../../../../api/course/CourseCollection';

interface ItemProps {
  name: string;
  position?: string;
  num?: string;
  description: string;
  interestIDs?: string[];
  slugID: string;
  _id: string;
}

interface LandingExplorerCardProps {
  item: ItemProps;
  type: string;
}

const LandingExplorerCard: React.FC<LandingExplorerCardProps> = ({ item, type }) => {
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/${type}/${getSlug(item)}`;
  let title;
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      title = Courses.getName(item._id);
      break;
    case EXPLORER_TYPE.INTERNSHIPS:
      title = item.position;
      break;
    default:
      title = docToName(item);
      break;
  }
  const match = useRouteMatch();
  const itemShortDescription = docToShortDescription(item);
  return (
    <Card>
      <Card.Content className="content">
        <div className="header">{title}</div>
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

export default LandingExplorerCard;
