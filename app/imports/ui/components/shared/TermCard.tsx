import * as React from 'react';
import { Button, Card, Icon, SemanticCOLORS } from 'semantic-ui-react'; // eslint-disable-line
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { Link, withRouter } from 'react-router-dom';
import { ITermCard } from '../../../typings/radgrad'; // eslint-disable-line
import IceHeader from './IceHeader';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import InterestList from './InterestList';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import TermAdd from './TermAdd';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';

class TermCard extends React.Component<ITermCard> {
  constructor(props) {
    super(props);
  }

  private isType = (typeToCheck) => {
    const { type } = this.props;
    return type === typeToCheck;
  }

  private itemName = (item) => {
    if (this.isType(EXPLORER_TYPE.COURSES)) {
      return `${item.name} (${item.num})`;
    }
    return item.name;
  }

  private itemSlug = (item) => Slugs.findDoc(item.slugID).name;

  // This was originally in a ui/utilities/template-helpers.js (radgrad1) file called opportunitySemesters
  // Should move it to one if one is made - Gian.
  private opportunityTerms(opportunityInstance) {
    const academicTermIDs = opportunityInstance.termIDs;
    const upcomingAcademicTerms = _.filter(academicTermIDs, termID => AcademicTerms.isUpcomingTerm(termID));
    return _.map(upcomingAcademicTerms, termID => AcademicTerms.toString(termID));

  }

  private replaceTermString(array) {
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const currentYear = currentTerm.year;
    let fourRecentTerms = _.filter(array, function isRecent(termYear) {
      return termYear.split(' ')[1] >= currentYear;
    });
    fourRecentTerms = array.slice(0, 4);
    const termString = fourRecentTerms.join(' - ');
    return termString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');

  }

  private itemTerms = () => {
    const { item } = this.props;
    let ret = [];
    if (this.isType(EXPLORER_TYPE.COURSES)) {
      // do nothing
    } else {
      ret = this.opportunityTerms(item);
    }
    return ret;
  }

  private itemShortDescription = (item) => {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return `${description}...`;
  }

  private numberStudents = (item) => {
    const participatingStudents = StudentParticipations.findDoc({ itemID: item._id });
    return participatingStudents.itemCount;
  }

  private getUsername = () => this.props.match.params.username;

  private hidden = () => {
    const username = this.getUsername();
    let ret = '';
    const profile = Users.getProfile(username);
    if (this.isType(EXPLORER_TYPE.COURSES)) {
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
    const profile = Users.getProfile(this.getUsername());
    const id = this.props.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: any = {};
    updateData.id = profile._id;
    if (this.isType(EXPLORER_TYPE.COURSES)) {
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
    const profile = Users.getProfile(this.getUsername());
    const id = this.props.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: any = {};
    updateData.id = profile._id;
    if (this.isType(EXPLORER_TYPE.COURSES)) {
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
    const itemName = this.itemSlug(item);
    let route = '';
    switch (type) {
      case EXPLORER_TYPE.COURSES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemName}`);
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemName}`);
        break;
      default:
        route = '#';
        break;
    }
    return route;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item, type, canAdd, isStudent, match } = this.props;
    const itemName = this.itemName(item);
    const isTypeOpportunity = this.isType('opportunities');
    const itemTerms = this.itemTerms();
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberStudents(item);
    const hidden = this.hidden() as SemanticCOLORS;

    return (
      <Card className="radgrad-interest-card">
        <Card.Content>
          <Card.Header>
            {itemName}
            {isTypeOpportunity ? <IceHeader ice={item.ice}/> : ''}
          </Card.Header>

          <Card.Meta>
            {itemTerms ? this.replaceTermString(itemTerms) : ''}
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

              {
                isStudent ?
                  [
                    canAdd ?
                      <TermAdd key={_.uniqueId()} item={item} type={type}/>
                      : '',
                  ]
                  : ''
              }

              {
                isStudent ?
                  [
                    hidden ?
                      <Button key={_.uniqueId()} onClick={this.handleUnHideItem}><Icon
                        name="unhide"/><br/>Unhide</Button>
                      :
                      <Button key={_.uniqueId()} onClick={this.handleHideItem}><Icon name="hide"/><br/>Hide</Button>,
                  ]
                  : ''
              }
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
