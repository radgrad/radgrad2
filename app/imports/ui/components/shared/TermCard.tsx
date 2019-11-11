import * as React from 'react';
import { Button, Card, Icon, SemanticCOLORS } from 'semantic-ui-react'; // eslint-disable-line
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { Link, withRouter } from 'react-router-dom';

import { ITermCard } from '../../../typings/radgrad'; // eslint-disable-line
import IceHeader from './IceHeader';
import InterestList from './InterestList';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import {
  docToShortDescription,
  opportunityTerms,
  studentsParticipating,
  itemToSlugName,
} from './data-model-helper-functions';
import { replaceTermStringNextFour } from './helper-functions';
import FutureParticipation from './FutureParticipation';

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

const hidden = (props: ITermCard) => {
  const username = Router.getUsername(props.match);
  let ret = '';
  const profile = Users.getProfile(username);
  if (isType(EXPLORER_TYPE.COURSES, props)) {
    if (_.includes(profile.hiddenCourseIDs, props.item._id)) {
      ret = 'grey';
    }
  } else if (_.includes(profile.hiddenOpportunityIDs, props.item._id)) {
    ret = 'grey';
  }
  return ret;
};

const buildRouteName = (item, type, props: ITermCard) => {
  const itemSlug = itemToSlugName(item);
  let route = '';
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      route = Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemSlug}`);
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      route = Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemSlug}`);
      break;
    default:
      route = '#';
      break;
  }
  return route;
};

const TermCard = (props: ITermCard) => {
  const { item, match } = props;
  const name = itemName(item, props);
  const isTypeOpportunity = isType('opportunities', props);
  const itemShortDescription = docToShortDescription(item);
  const numberStudents = studentsParticipating(item);
  const hide = hidden(props) as SemanticCOLORS;

  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>
          {name}
          {isTypeOpportunity ? <IceHeader ice={item.ice}/> : ''}
        </Card.Header>

        <Card.Meta>
          {itemTerms ? replaceTermStringNextFour(itemTerms(props)) : ''}
        </Card.Meta>
      </Card.Content>

      <Card.Content>
        <Markdown escapeHtml={true} source={itemShortDescription}
                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
        <InterestList item={item} size="mini"/>
      </Card.Content>
      <Card.Content>
        <FutureParticipation type={props.type} item={props.item}/>
      </Card.Content>
      <Card.Content>
        <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
      </Card.Content>

      <Link to={buildRouteName(props.item, props.type, props)}>
        <Button className="radgrad-home-buttons center aligned" attached="bottom" color={hide || undefined}>
          <Icon name="chevron circle right"/><br/>View More
        </Button>
      </Link>
    </Card>
  );
};

export default withRouter(TermCard);