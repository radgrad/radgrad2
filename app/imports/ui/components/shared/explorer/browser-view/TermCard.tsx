import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import { CourseScoreboard, OpportunityScoreboard } from '../../../../../startup/client/collections';

import { AcademicTerm, TermCard } from '../../../../../typings/radgrad';
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
  const numberStudents = studentsParticipating(item);
  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: numTerms,
  });
  const scores = [];
  _.forEach(academicTerms, (term: AcademicTerm) => {
    const id = `${item._id} ${term._id}`;
    if (type === EXPLORER_TYPE.COURSES) {
      const score = CourseScoreboard.find({ _id: id }).fetch() as { count: number }[];
      if (score.length > 0) {
        scores.push(score[0].count);
      } else {
        scores.push(0);
      }
    } else {
      const score = OpportunityScoreboard.find({ _id: id }).fetch() as { count: number }[];
      if (score.length > 0) {
        scores.push(score[0].count);
      } else {
        scores.push(0);
      }
    }
  });
  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>
          {name}
          {isTypeOpportunity ? <IceHeader ice={item.ice} /> : ''}
        </Card.Header>

        <Card.Meta>
          {itemTerms ? replaceTermStringNextFour(itemTerms(item, type)) : ''}
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
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Card.Content>

      <Card.Content>
        <span>
          STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents} />
        </span>
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
