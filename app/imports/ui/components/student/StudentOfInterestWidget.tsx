import * as React from 'react';
import { Header, Segment, Card, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import StudentOfInterestCard from './StudentOfInterestCard';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { setStudentHomeWidgetHidden } from '../../../redux/actions/studentHomePageActions';

interface IStudentOfInterestWidgetProps {
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  dispatch: any;
  hidden: boolean;
}

const mapStateToProps = (state) => ({
  hidden: state.studentHomePage.studentOfInterestWidget.hidden,
});

class StudentOfInterestWidget extends React.Component<IStudentOfInterestWidgetProps> {
  constructor(props) {
    super(props);
  }

  private isHidden = (): boolean => this.props.hidden

  private hiddenExists() {
    const username = this.getUsername();
    if (username) {
      const profile = Users.getProfile(username);
      let ret;
      if (this.typeCourse()) {
        ret = profile.hiddenCourseIDs.length !== 0;
      } else {
        ret = profile.hiddenOpportunityIDs.length !== 0;
      }
      return ret;
    }
    return false;
  }

  private handleShowHidden = (e) => {
    e.preventDefault();
    this.props.dispatch(setStudentHomeWidgetHidden(false));
  }

  private handleHideHidden = (e) => {
    e.preventDefault();
    this.props.dispatch(setStudentHomeWidgetHidden(true));
  }

  private getUsername = () => this.props.match.params.username;

  private itemCount = () => {
    let ret;
    if (this.typeCourse()) {
      ret = this.hiddenCoursesHelper().length;
    } else {
      ret = this.hiddenOpportunitiesHelper().length;
    }
    return ret;
  }

  private courses = () => {
    const courses = this.matchingCourses();
    let visibleCourses;
    if (this.isHidden()) {
      visibleCourses = this.hiddenCoursesHelper();
    } else {
      visibleCourses = courses;
    }
    return visibleCourses;
  }

  private typeCourse = (): boolean => this.props.type === 'courses';

  private opportunities = () => {
    const opportunities = this.matchingOpportunities();
    let visibleOpportunities;
    if (this.isHidden()) {
      visibleOpportunities = this.hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    return visibleOpportunities;
  }

  private matchingCourses = () => {
    if (this.getUsername()) {
      const allCourses = this.availableCourses();
      const matching: any = [];
      const profile = Users.getProfile(this.getUsername());
      // console.log('StudentProfile=%o', profile);
      const userInterests = [];
      let courseInterests = [];
      _.forEach(Users.getInterestIDs(profile.userID), (id) => {
        userInterests.push(Interests.findDoc(id));
      });
      _.forEach(allCourses, (course) => {
        courseInterests = [];
        _.forEach(course.interestIDs, (id) => {
          courseInterests.push(Interests.findDoc(id));
          _.forEach(courseInterests, (courseInterest) => {
            _.forEach(userInterests, (userInterest) => {
              if (_.isEqual(courseInterest, userInterest)) {
                if (!_.includes(matching, course)) {
                  matching.push(course);
                }
              }
            });
          });
        });
      });
      // Only display up to the first six matches.
      return (matching < 7) ? matching : matching.slice(0, 6);
    }
    return [];
  }

  private availableCourses = () => {
    const courses = Courses.findNonRetired({});
    if (courses.length > 0) {
      const filtered = _.filter(courses, (course) => {
        if (course.number === 'ICS 499') { // TODO: WHy is ICS 499 hardcoded?
          return true;
        }
        const ci = CourseInstances.find({
          studentID: this.getUserIdFromRoute(),
          courseID: course._id,
        }).fetch();
        return ci.length === 0;
      });
      return filtered;
    }
    return [];
  }

  private hiddenCoursesHelper = () => {
    if (this.getUsername()) {
      const courses = this.matchingCourses();
      let nonHiddenCourses;
      if (this.isHidden()) {
        const profile = Users.getProfile(this.getUsername());
        nonHiddenCourses = _.filter(courses, (course) => {
          if (_.includes(profile.hiddenCourseIDs, course._id)) {
            return false;
          }
          return true;
        });
      } else {
        nonHiddenCourses = courses;
      }
      return nonHiddenCourses;
    }
    return [];
  }

  private hiddenOpportunitiesHelper = () => {
    if (this.getUsername()) {
      const opportunities = this.matchingOpportunities();
      let nonHiddenOpportunities;
      if (this.isHidden()) {
        const profile = Users.getProfile(this.getUsername());
        nonHiddenOpportunities = _.filter(opportunities, (opp) => {
          if (_.includes(profile.hiddenOpportunityIDs, opp._id)) {
            return false;
          }
          return true;
        });
      } else {
        nonHiddenOpportunities = opportunities;
      }
      return nonHiddenOpportunities;
    }
    return [];
  }

  private matchingOpportunities = () => {
    const allOpportunities = this.availableOpps();
    const matching: any = [];
    const profile = Users.getProfile(this.getUsername());
    const userInterests = [];
    let opportunityInterests = [];
    _.forEach(Users.getInterestIDs(profile.userID), (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.forEach(allOpportunities, (opp) => {
      opportunityInterests = [];
      _.forEach(opp.interestIDs, (id) => {
        opportunityInterests.push(Interests.findDoc(id));
        _.forEach(opportunityInterests, (oppInterest) => {
          _.forEach(userInterests, (userInterest) => {
            if (_.isEqual(oppInterest, userInterest)) {
              if (!_.includes(matching, opp)) {
                matching.push(opp);
              }
            }
          });
        });
      });
    });
    // Only display up to the first six matches.
    return (matching < 7) ? matching : matching.slice(0, 6);
  }

  private getUserIdFromRoute = () => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private availableOpps = () => {
    const notRetired = Opportunities.findNonRetired({});
    const currentSemester = AcademicTerms.getCurrentAcademicTermDoc();
    if (notRetired.length > 0) {
      const filteredBySem = _.filter(notRetired, (opp) => {
        const oi = OpportunityInstances.find({
          studentID: this.getUserIdFromRoute(),
          opportunityID: opp._id,
        }).fetch();
        return oi.length === 0;
      });
      return _.filter(filteredBySem, (opp) => {
        let inFuture = false;
        _.forEach(opp.semesterIDs, (semID) => {
          const sem = AcademicTerms.findDoc(semID);
          if (sem.semesterNumber >= currentSemester.semesterNumber) {
            inFuture = true;
          }
        });
        return inFuture;
      });
    }
    return [];
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    /*
     Had to declare the properties of some of the CSS attributes as themselves to fix
     the "Type X is not assignable to Type Y" errors
     See https://github.com/microsoft/TypeScript/issues/11465#issuecomment-252453037
     */
    const uppercaseTextTransformStyle = { textTransform: 'uppercase' as 'uppercase' };
    const cardsStackableStyle = {
      maxHeight: '500px',
      overflowX: 'hidden' as 'hidden',
      overflowY: 'scroll' as 'scroll',
      marginTop: '10px',
    };

    const { type } = this.props;
    const hiddenExists = this.hiddenExists();
    const isHidden = this.isHidden();
    const isTypeCourse = this.typeCourse();
    const courses = this.courses();
    const opportunities = this.opportunities();
    console.log('%o', opportunities);

    return (
      <Segment padded={true}>
        <Header as="h4" dividng="true">
          RECOMMENDED <span style={uppercaseTextTransformStyle}> {type}</span> <WidgetHeaderNumber
          inputValue={this.itemCount()}/>
        </Header>

        {/* I'm not sure how to test if the particular code block below works because even on the original radgrad, I could not find anywhere on the website through Chrome Debugger where this piece of code is used. There were no "HIDDEN" texts anywhere or where the buttons would appear that has the color green with chevron icons. */}
        {
          hiddenExists ?
            [
              isHidden ?
                <Button basic={true} color="green" size="mini" onClick={this.handleShowHidden}>
                  <Icon name="chevron up"/> HIDDEN <span style={uppercaseTextTransformStyle}>{type}</span>
                </Button>
                :
                <Button basic={true} color="green" size="mini" onClick={this.handleHideHidden}>
                  <Icon name="chevron down"/> HIDDEN <span style={uppercaseTextTransformStyle}>{type}</span>
                </Button>,
            ]
            : ''
        }

        {
          courses ?
            <div style={cardsStackableStyle}>
              <Card.Group stackable={true} itemsPerRow={2}>
                {
                  isTypeCourse ?
                    courses.map((course, index) => <StudentOfInterestCard key={index} item={course}
                                                                          type={type} canAdd={true}/>)
                    :
                    // FIXME: THis is not appearing
                    opportunities.map((opp, index) => <StudentOfInterestCard key={index} item={opp}
                                                                             type={type} canAdd={true}/>)
                }
              </Card.Group>
            </div>
            :
            <p>Add interests to see recommendations here. To add interests, click on the &quot;Explorer&quot; tab,
              then select &quot;Interests&quot; in the pull-down menu on that page.</p>
        }
      </Segment>
    );
  }
}

const StudentOfInterestWidgetContainer = connect(mapStateToProps)(StudentOfInterestWidget);
export default withRouter(StudentOfInterestWidgetContainer);
