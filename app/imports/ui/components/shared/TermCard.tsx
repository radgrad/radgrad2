import * as React from 'react';
import { Button, Card, Icon, SemanticCOLORS } from 'semantic-ui-react'; // eslint-disable-line
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { ITermCard } from '../../../typings/radgrad'; // eslint-disable-line
import IceHeader from './IceHeader';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import InterestList from './InterestList';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import TermAdd from './TermAdd';

class TermCard extends React.Component<ITermCard> {
  constructor(props) {
    super(props);
  }

  private isType = (typeToCheck) => {
    const { type } = this.props;
    return type === typeToCheck;
  }

  private itemName = (item) => {
    if (this.isType('courses')) {
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
    if (this.isType('courses')) {
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

  private numberStudents = (course) => this.interestedStudentsHelper(course, this.props.type).length

  private interestedStudentsHelper = (item, type) => {
    let instances;
    if (type === 'courses') {
      instances = CourseInstances.find({
        courseID: item._id,
      }).fetch();
    } else {
      instances = OpportunityInstances.find({
        opportunityID: item._id,
      }).fetch();
    }
    return _.uniqBy(instances, i => i.studentID);
  }

  private getUsername = () => this.props.match.params.username;

  private hidden = () => {
    const username = this.getUsername();
    let ret = '';
    const profile = Users.getProfile(username);
    if (this.isType('courses')) {
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
    if (this.isType('courses')) {
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
    if (this.isType('courses')) {
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
  /*
    Because we are using react-router, the converted markdown hyperlinks won't be redirected properly. This is a solution.
    See https://github.com/rexxars/react-markdown/issues/29#issuecomment-231556543
  */
  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )

  private buildRouteName = (item, type) => {
    const itemName = this.itemSlug(item);
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    switch (type) {
      case 'courses':
        return `${baseRoute}explorer/courses/${itemName}`;
      case 'opportunities':
        return `${baseRoute}explorer/opportunities/${itemName}`;
      default:
        break;
    }
    return '#';
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item, type, match } = this.props;
    const itemName = this.itemName(item);
    const isTypeOpportunity = this.isType('opportunities');
    const itemTerms = this.itemTerms();
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberStudents(item);
    const hidden = this.hidden() as SemanticCOLORS;
    const isStudent = this.props.isStudent;
    const canAdd = this.props.canAdd;

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
          <Markdown escapeHtml={true} source={itemShortDescription} renderers={{ link: this.routerLink }}/>
          <InterestList item={item} size="mini"/>
        </Card.Content>

        <Card.Content>
          <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
        </Card.Content>

        {/* FIXME: The three buttons are not all the same size. "View More" button is smaller compared to the other two
                    buttons. I think this *might* just be because we do not have the Card Explorer Menu on the left of the
                    CardExplorerWidget yet. */}
        {
          isStudent ?
            <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" widths={3}
                          color={hidden || undefined}>
              {
                <Link to={this.buildRouteName(this.props.item, this.props.type)}>
                  <Button><Icon name="chevron circle right"/><br/>View More</Button>
                </Link>
              }

              {
                isStudent ?
                  [
                    canAdd ?
                      <TermAdd key={_.uniqueId()} item={item} type={type} match={match}/>
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

export default TermCard;
