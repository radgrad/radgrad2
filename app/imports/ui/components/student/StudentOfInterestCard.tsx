import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { Button, Card, Header, Icon, Image, Popup, SemanticCOLORS } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import InterestList from '../shared/InterestList';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import StudentOfInterestAdd from './StudentOfInterestAdd';
import { renderLink } from '../shared/RouterHelperFunctions';

interface IStudentOfInterestCardProps {
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  item: {
    _id: string;
  };
  profile: {
    _id: string;
  };
}

class StudentOfInterestCard extends React.Component<IStudentOfInterestCardProps> {
  constructor(props) {
    super(props);
  }

  private handleHideStudentInterest = (e) => {
    e.preventDefault();
    const username = this.getUsername();
    const profile = Users.getProfile(username);
    const id = this.props.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: any = {};
    updateData.id = profile._id;
    if (this.isTypeCourse()) {
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

  private handleUnHideStudentInterest = (e) => {
    e.preventDefault();
    const username = this.getUsername();
    const profile = Users.getProfile(username);
    const id = this.props.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData: any = {};
    updateData.id = profile._id;
    if (this.isTypeCourse()) {
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

  // This was originally in a ui/utilities/template-helpers.js (radgrad1) file called opportunitySemesters
  // Should move it to one if one is made - Gian.
  private opportunityTerms(opportunityInstance) {
    const academicTermIDs = opportunityInstance.termIDs;
    const upcomingAcademicTerms = _.filter(academicTermIDs, termID => AcademicTerms.isUpcomingTerm(termID));
    return _.map(upcomingAcademicTerms, termID => AcademicTerms.toString(termID));
  }

  private itemName = (item) => item.name;

  private itemSlug = (item) => Slugs.findDoc(item.slugID).name;

  private itemTerms = () => {
    let ret = [];
    if (this.isTypeCourse()) {
      // do nothing
    } else {
      ret = this.opportunityTerms(this.props.item);
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
    return description;
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

  private numberStudents = (course) => this.interestedStudentsHelper(course, this.props.type).length;

  private interestedStudents = (course) => this.interestedStudentsHelper(course, this.props.type);

  private interestedStudentsHelper = (item, type) => {
    const interested = [];
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
    // console.log(instances.length);
    _.forEach(instances, (c) => {
      if (!_.includes(interested, c.studentID)) {
        interested.push(c.studentID);
      }
    });
    return interested;
  }

  private studentFullName = (studentID) => {
    if (studentID === 'elispsis') {
      return '';
    }
    return Users.getFullName(studentID);
  }

  private studentPicture = (studentID) => {
    if (studentID === 'elipsis') {
      return '/images/elipsis.png';
    }
    return Users.getProfile(studentID).picture;
  }

  private isTypeCourse = () => this.props.type === 'courses'

  private hidden = () => {
    const username = this.props.match.params.username;
    let ret = '';
    const profile = Users.getProfile(username);
    if (this.isTypeCourse()) {
      if (_.includes(profile.hiddenCourseIDs, this.props.item._id)) {
        ret = 'grey';
      }
    } else if (_.includes(profile.hiddenOpportunityIDs, this.props.item._id)) {
      ret = 'grey';
    }
    return ret;
  }

  private getUsername = () => this.props.match.params.username;

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
    const { item, match } = this.props;
    const itemName = this.itemName(item);
    const itemTerms = this.itemTerms();
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberStudents(item);
    const interestedStudents = this.interestedStudents(item);
    const hidden = this.hidden() as SemanticCOLORS;

    return (
      <Card className="radgrad-interest-card">
        <Card.Content>
          <Header>{itemName}</Header>
          <Card.Meta>
            {
              itemTerms ? this.replaceTermString(itemTerms) : ''
            }
          </Card.Meta>
        </Card.Content>

        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                    renderers={{ link: (props) => renderLink(props, match) }}/>
          <InterestList item={item} size='mini'/>
        </Card.Content>

        <Card.Content>
          <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
          <Image.Group size="mini">
            {
              interestedStudents.map((student, index) => <Popup
                key={index}
                trigger={<Image src={this.studentPicture(student)} circular={true} bordered={true}/>}
                content={this.studentFullName(student)}
              />)
            }
          </Image.Group>
        </Card.Content>

        {
          <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" widths={3}
                        color={hidden || undefined}>
            <Link to={this.buildRouteName(this.props.item, this.props.type)}>
              <Button><Icon name="chevron circle right"/><br/>View More</Button>
            </Link>

            {this.props.canAdd ?
              <StudentOfInterestAdd item={this.props.item} type={this.props.type}/>
              : ''
            }

            {
              hidden ?
                <Button onClick={this.handleUnHideStudentInterest}><Icon name="unhide"/><br/>Unhide</Button>
                :
                <Button onClick={this.handleHideStudentInterest}><Icon name="hide"/><br/>Hide</Button>
            }
          </Button.Group>
        }
      </Card>
    );
  }
}

export default withRouter(StudentOfInterestCard);
