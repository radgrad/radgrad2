import * as React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { Link, withRouter } from 'react-router-dom';
import { IExplorerCard } from '../../../typings/radgrad'; // eslint-disable-line
import * as Router from './RouterHelperFunctions';
import { docToName, docToShortDescription } from './data-model-helper-functions';
import { buildExplorerRoute } from './explorer-helper-functions';

const ExplorerCard = (props: IExplorerCard) => {
  const { item, match } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);

  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
        <Card.Meta/>
      </Card.Content>

      <Card.Content>
        <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                  renderers={{ link: (p) => Router.renderLink(p, match) }}/>
      </Card.Content>

      <Link to={buildExplorerRoute(props.item, props)}>
        <Button className="radgrad-home-buttons center aligned" attached="bottom"><Icon
          name="chevron circle right"/><br/>View More</Button>
      </Link>
    </Card>
  );
};

export default withRouter(ExplorerCard);
