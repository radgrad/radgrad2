import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { Link, useRouteMatch } from 'react-router-dom';

import { ITermCard } from '../../../../../typings/radgrad';
import IceHeader from '../../IceHeader';
import InterestList from '../../InterestList';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import * as Router from '../../utilities/router';
import {
  docToShortDescription,
  opportunityTerms,
  studentsParticipating,
  itemToSlugName,
} from '../../utilities/data-model';
import { replaceTermStringNextFour } from '../../utilities/general';
import FutureParticipation from '../FutureParticipation';

const isType = (typeToCheck: string, props: ITermCard) => {
  const { type } = props;
  return type === typeToCheck;
};

const itemName = (item, props: ITermCard) => {
  if (isType(EXPLORER_TYPE.COURSES, props)) {
    return `${item.name} (${item.num})`;
  }
  return item.name;
};

const itemTerms = (props: ITermCard) => {
  const { item } = props;
  let ret = [];
  if (isType(EXPLORER_TYPE.COURSES, props)) {
    // do nothing
  } else {
    ret = opportunityTerms(item);
  }
  return ret;
};

const buildRouteName = (item, type, match) => {
  const itemSlug = itemToSlugName(item);
  let route: string;
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemSlug}`);
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemSlug}`);
      break;
    default:
      route = '#';
      break;
  }
  return route;
};

// TODO Why is this named this?
// TODO Redesign the Cards.

const TermCard = (props: ITermCard) => {
  const { item } = props;
  const match = useRouteMatch();
  const name = itemName(item, props);
  const isTypeOpportunity = isType('opportunities', props);
  const itemShortDescription = docToShortDescription(item);
  const numberStudents = studentsParticipating(item);

  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>
          {name}
          {isTypeOpportunity ? <IceHeader ice={item.ice} /> : ''}
        </Card.Header>

        <Card.Meta>
          {itemTerms ? replaceTermStringNextFour(itemTerms(props)) : ''}
        </Card.Meta>
      </Card.Content>

      <Card.Content>
        <Markdown
          escapeHtml
          source={itemShortDescription}
          renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
        />
        <InterestList item={item} size="mini" />
      </Card.Content>

      <Card.Content>
        <FutureParticipation type={props.type} item={props.item} />
      </Card.Content>

      <Card.Content>
        <span>
          STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents} />
        </span>
      </Card.Content>

      <Link className="ui button" to={buildRouteName(props.item, props.type, match)}>
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};

export default TermCard;
