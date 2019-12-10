import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import * as Router from './RouterHelperFunctions';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import {
  docToName,
  docToShortDescription,
} from './data-model-helper-functions';
import { buildExplorerRoute } from './explorer-helper-functions';
import { IExplorerCard } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars

const ProfileCard = (props: IExplorerCard) => {
  const { item, match, numFavorites } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  return (
    <Card className='radgrad-interest-card'>
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
      </Card.Content>
      <Card.Content>
        <span>FAVORITED <WidgetHeaderNumber inputValue={numFavorites}/></span>
      </Card.Content>
      <Link to={buildExplorerRoute(props.item, props)} className='ui button'>
        <Icon name='chevron circle right'/>
        <br/>
        View More
      </Link>
    </Card>
  );
};


export default withRouter(ProfileCard);
