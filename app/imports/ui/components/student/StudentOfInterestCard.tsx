import * as React from 'react';
import { Card, Header, Image, Button, Icon } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import * as _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import InterestList from '../shared/InterestList';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IStudentOfInterestCardProps {
  item: any,
  type: string,
  canAdd: boolean,
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentOfInterestCard extends React.Component<IStudentOfInterestCardProps> {
  constructor(props) {
    super(props);
  }


  // This was originally in a template-helpers.js file. Should move it to one if one is made - Gian.
  private opportunityTerms(opportunityInstance) {
    const academicTermIDs = opportunityInstance.semesterIDs;
    const upcomingAcademicTerms = _.filter(academicTermIDs, semesterID => AcademicTerms.isUpcomingTerm(semesterID));
    return _.map(upcomingAcademicTerms, semesterID => AcademicTerms.toString(semesterID));
  }

  private itemName = (item) => item.name;

  private itemSlug = (item) => Slugs.findDoc(item.slugID).name;

  private itemTerms = () => {
    let ret = [];
    if (this.props.type === 'courses') {
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

  private numberStudents = (course) => this.interestedStudentsHelper(course, this.props.type).length

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

  private typeCourse = () => this.props.type === 'courses'

  private hidden = () => {
    const username = this.props.match.params.username;
    let ret = '';
    const profile = Users.getProfile(username);
    if (this.props.type === 'courses') {
      if (_.includes(profile.hiddenCourseIDs, this.props.item._id)) {
        ret = 'grey';
      }
    } else
    if (_.includes(profile.hiddenOpportunityIDs, this.props.item._id)) {
      ret = 'grey';
    }
    return ret;
  }

  private getUsername = () => this.props.match.params.username;

  private getRouteName = (item, type) => {
    const itemName = this.itemSlug(item);
    switch (type) {
      case 'courses':
        return `/student/${this.getUsername()}/explorer/courses/${itemName}`;
      case 'opportunities':
        return `/student/${this.getUsername()}/explorer/opportunities/${itemName}`;
      default:
        break;
    }
    return '#';
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item } = this.props;
    const itemName = this.itemName(item);
    const itemSemesters = this.itemTerms();
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberStudents(item);
    const interestedStudents = this.interestedStudents(item);

    // Determines if the <Button.Group> should have a grey color attribute.
    const hidden = this.hidden();
    const isHidden = !!hidden; // hidden ? true : false

    return (
        <Card className="radgrad-interest-card">
          <Card.Content>
            <Header>{itemName}</Header>
            <Card.Meta>
              {
                itemSemesters ? this.replaceTermString(itemSemesters) : ''
              }
            </Card.Meta>
          </Card.Content>

          <Card.Content>
            <p>{itemShortDescription}</p>
            <InterestList item={item} size='mini'/>
          </Card.Content>

          <Card.Content>
            <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
            <Image.Group circular={true} size="mini" bordered={true}>
              {
                interestedStudents.map((student, index) => <Image key={index}
                                                                  data-content={this.studentFullName(student)}
                                                                  src={this.studentPicture(student)}/>)
              }
            </Image.Group>
          </Card.Content>

          {/* Missing a "Center aligned" attribute */}
          {
            // TODO: Test if we color=""" is valid so we don't have two Button Groups
            isHidden ?
                <Button.Group className="radgrad-home-buttons" attached="bottom" widths={3} color="grey">
                        <Link to={this.getRouteName(this.props.item, this.props.type)}>
                          <Button><Icon name="chevron circle right"/><br/>View More</Button>
                        </Link>

                  {this.props.canAdd ?
                      // TODO: StudentOfInterestAdd
                      <br/>
                    : ''}

                  {
                    hidden ?
                        <Button><Icon name="unhide"/><br/>Unhide</Button>
                        :
                        <Button><Icon name="hide"/><br/>Hide</Button>
                  }
                </Button.Group>
                :
                // This should be the same exact code as above, but this one has no color to the button
                ''
                // <Button.Group className="radgrad-home-buttons" attached="bottom" widths={3}>
                // </Button.Group>
          }

        </Card>
    );
  }
}

export default withRouter(StudentOfInterestCard);
