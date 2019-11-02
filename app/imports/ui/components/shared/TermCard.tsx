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


class TermCard extends React.Component<ITermCard> {
  constructor(props) {
    super(props);
  }

  private itemTerms = () => {
    const { item } = this.props;
    let ret = [];
    if (isType(EXPLORER_TYPE.COURSES, this.props)) {
      // do nothing
    } else {
      ret = opportunityTerms(item);
    }
    return ret;
  }

  private hidden = () => {
    const username = Router.getUsername(this.props.match);
    let ret = '';
    const profile = Users.getProfile(username);
    if (isType(EXPLORER_TYPE.COURSES, this.props)) {
      if (_.includes(profile.hiddenCourseIDs, this.props.item._id)) {
        ret = 'grey';
      }
    } else if (_.includes(profile.hiddenOpportunityIDs, this.props.item._id)) {
      ret = 'grey';
    }
    return ret;
  }

  private handleHideItem = (e) => {
    e.preventDefault();
    const profile = Users.getProfile(Router.getUsername(this.props.match));
    const id = this.props.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: any = {};
    updateData.id = profile._id;
    if (isType(EXPLORER_TYPE.COURSES, this.props)) {
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
  }

  private handleUnHideItem = (e) => {
    e.preventDefault();
    const profile = Users.getProfile(Router.getUsername(this.props.match));
    const id = this.props.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: any = {};
    updateData.id = profile._id;
    if (isType(EXPLORER_TYPE.COURSES, this.props)) {
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
  }

  private buildRouteName = (item, type) => {
    const itemSlug = itemToSlugName(item);
    let route = '';
    switch (type) {
      case EXPLORER_TYPE.COURSES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemSlug}`);
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemSlug}`);
        break;
      default:
        route = '#';
        break;
    }
    return route;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item, type, isStudent, match } = this.props;
    const name = itemName(item, this.props);
    const isTypeOpportunity = isType('opportunities', this.props);
    const itemTerms = this.itemTerms();
    const itemShortDescription = docToShortDescription(item);
    const numberStudents = studentsParticipating(item);
    const hidden = this.hidden() as SemanticCOLORS;

    return (
      <Card className="radgrad-interest-card">
        <Card.Content>
          <Card.Header>
            {name}
            {isTypeOpportunity ? <IceHeader ice={item.ice}/> : ''}
          </Card.Header>

          <Card.Meta>
            {itemTerms ? replaceTermStringNextFour(itemTerms) : ''}
          </Card.Meta>
        </Card.Content>

        <Card.Content>
          <Markdown escapeHtml={true} source={itemShortDescription}
                    renderers={{ link: (props) => Router.renderLink(props, match) }}/>
          <InterestList item={item} size="mini"/>
        </Card.Content>

        <Card.Content>
          <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
        </Card.Content>

        {
          isStudent ?
            <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" color={hidden || undefined}
                          widths={3}>
              <Link className="ui button" to={this.buildRouteName(this.props.item, this.props.type)}>
                <Icon name="chevron circle right"/><br/>View More
              </Link>
            </Button.Group>
            :
            <Link to={this.buildRouteName(this.props.item, this.props.type)}>
              <Button className="radgrad-home-buttons center aligned" attached="bottom" color={hidden || undefined}>
                <Icon name="chevron circle right"/><br/>View More
              </Button>
            </Link>
        }
      </Card>
    );
  }
}

export default withRouter(TermCard);
