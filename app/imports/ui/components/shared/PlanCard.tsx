import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { IAcademicPlan, IPlanCard } from '../../../typings/radgrad'; // eslint-disable-line
import WidgetHeaderNumber from './WidgetHeaderNumber';
import AcademicPlanStaticViewer from './AcademicPlanStaticViewer';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import * as Router from './RouterHelperFunctions';
import {
  docToName,
  docToShortDescription,
  itemToSlugName,
} from './data-model-helper-functions';

const PlanCard = (props: IPlanCard) => {
  // console.log('PlanCard props', props);
  const { item, numFavorites } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const itemSlug = itemToSlugName(item);
  const route = Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${itemSlug}`);

  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
      </Card.Content>

      <Card.Content>
        <Markdown escapeHtml source={`${itemShortDescription}...`} />
        <AcademicPlanStaticViewer plan={item} />
      </Card.Content>

      <Card.Content>
        <span>
FAVORITED
          <WidgetHeaderNumber inputValue={numFavorites} />
        </span>
      </Card.Content>

      <Link className="ui button" to={route}>
        <Icon name="chevron circle right" />
        <br />
View More
      </Link>
    </Card>
  );
};

export default withRouter(PlanCard);
