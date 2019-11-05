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
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import {
  docToShortDescription,
  itemToSlugName,
  opportunityTerms,
  studentsParticipating,
} from './data-model-helper-functions';
import { replaceTermStringNextFour } from './helper-functions';
import FutureParticipation from './FutureParticipation';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';

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

const handleHideItem = (props: ITermCard) => (e) => {
  e.preventDefault();
  const profile = Users.getProfile(Router.getUsername(props.match));
  const id = props.item._id;
  const collectionName = StudentProfiles.getCollectionName();
  const updateData: any = {};
  updateData.id = profile._id;
  if (isType(EXPLORER_TYPE.COURSES, props)) {
    const studentItems = profile.hiddenCourseIDs;
    studentItems.push(id);
    updateData.hiddenCourses = studentItems;
  } else {
    const studentItems = profile.hiddenOpportunityIDs;
    studentItems.push(id);
    updateData.hiddenOpportunities = studentItems;
  }
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      console.log('Error hiding course/opportunity', error);
    }
  });
};

const handleUnHideItem = (props: ITermCard) => (e) => {
  e.preventDefault();
  const profile = Users.getProfile(Router.getUsername(props.match));
  const id = props.item._id;
  const collectionName = StudentProfiles.getCollectionName();
  const updateData: any = {};
  updateData.id = profile._id;
  if (isType(EXPLORER_TYPE.COURSES, props)) {
    let studentItems = profile.hiddenCourseIDs;
    studentItems = _.without(studentItems, id);
    updateData.hiddenCourses = studentItems;
  } else {
    let studentItems = profile.hiddenOpportunityIDs;
    studentItems = _.without(studentItems, id);
    updateData.hiddenOpportunities = studentItems;
  }
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      console.log('Error unhiding course/opportunity', error);
    }
  });
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
  const { item, type, canAdd, isStudent, match } = props;
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
                  renderers={{ link: (props) => Router.renderLink(props, match) }}/>
        <InterestList item={item} size="mini"/>
      </Card.Content>
      <Card.Content>
        <FutureParticipation type={this.props.type} item={this.props.item}/>
      </Card.Content>
      <Card.Content>
        <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
      </Card.Content>

      <Link to={this.buildRouteName(this.props.item, this.props.type)}>
        <Button className="radgrad-home-buttons center aligned" attached="bottom" color={hide || undefined}>
          <Icon name="chevron circle right"/><br/>View More
        </Button>
      </Link>
    </Card>
  );
};

export default withRouter(TermCard);
