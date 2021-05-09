import React from 'react';
import Markdown from 'react-markdown';
import { Link, useRouteMatch } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';

import { TermCard } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import FutureParticipationButton from '../../FutureParticipationButton';
import IceHeader from '../../IceHeader';
import InterestList from '../../InterestList';
import { docToShortDescription, itemToSlugName, opportunityTerms } from '../../utilities/data-model';
import { replaceTermStringNextFour } from '../../utilities/general';
import * as Router from '../../utilities/router';

const isType = (typeToCheck: string, type: string) => type === typeToCheck;

const itemName = (item, type: string) => {
  if (isType(EXPLORER_TYPE.COURSES, type)) {
    return `${item.name} (${item.num})`;
  }
  return item.name;
};

const itemTerms = (item, type) => {
  let ret = [];
  if (isType(EXPLORER_TYPE.COURSES, type)) {
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

const TermCard: React.FC<TermCard> = ({ item, type }) => {
  const match = useRouteMatch();
  const name = itemName(item, type);
  const isTypeOpportunity = isType('opportunities', type);
  const itemShortDescription = docToShortDescription(item);
  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {name}
          {isTypeOpportunity ? <IceHeader ice={item.ice} /> : ''}
        </Card.Header>

        <Card.Meta>{itemTerms ? replaceTermStringNextFour(itemTerms(item, type)) : ''}</Card.Meta>
      </Card.Content>

      <Card.Content>
        <Markdown escapeHtml source={itemShortDescription} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        <InterestList item={item} size="mini" />
      </Card.Content>

      <Card.Content>
        <FutureParticipationButton item={item} />
      </Card.Content>

      <Link className="ui button" to={buildRouteName(item, type, match)}>
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};

export default TermCard;
