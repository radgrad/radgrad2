import * as React from 'react';
import { Button, Card, Header, Icon, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import StudentOfInterestCard from './StudentOfInterestCard';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { homeActions } from '../../../redux/student/home';

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
  profile: any;
  nonRetiredCourses: object[];
  nonRetiredOpportunities: object[];
  hiddenCourses: boolean;
  hiddenOpportunities: boolean;
  dispatch: any;
  courseInstances: any[];
  opportunityInstances: any[];
}

const mapStateToProps = (state) => ({
  hiddenCourses: state.student.home.hiddenCourses,
  hiddenOpportunities: state.student.home.hiddenOpportunities,
});

class StudentOfInterestWidget extends React.Component<IStudentOfInterestWidgetProps> {
  constructor(props) {
    super(props);
  }

  private hiddenExists() {
    const username = this.getUsername();
    if (username) {
      const { profile } = this.props;
      let ret;
      if (this.isTypeCourse()) {
        ret = profile.hiddenCourseIDs.length !== 0;
      } else {
        ret = profile.hiddenOpportunityIDs.length !== 0;
      }
      return ret;
    }
    return false;
  }

  private isCoursesHidden = (): boolean => this.props.hiddenCourses

  private isOpportunitiesHidden = (): boolean => this.props.hiddenOpportunities

  private handleShowHiddenCourses = (e) => {
    e.preventDefault();
    this.props.dispatch(homeActions.setStudentHomeWidgetHiddenCourses(false));
  }

  private handleHideHiddenCourses = (e) => {
    e.preventDefault();
    this.props.dispatch(homeActions.setStudentHomeWidgetHiddenCourses(true));
  }

  private handleShowHiddenOpportunities = (e) => {
    e.preventDefault();
    this.props.dispatch(homeActions.setStudentHomeWidgetHiddenOpportunities(false));
  }

  private handleHideHiddenOpportunities = (e) => {
    e.preventDefault();
    this.props.dispatch(homeActions.setStudentHomeWidgetHiddenOpportunities(true));
  }

  private getUsername = () => this.props.match.params.username;

  private getUserIdFromRoute = () => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private itemCount = () => {
    let ret;
    if (this.isTypeCourse()) {
      ret = this.hiddenCoursesHelper().length;
    } else {
      ret = this.hiddenOpportunitiesHelper().length;
    }
    return ret;
  }

  private isTypeCourse = (): boolean => this.props.type === EXPLORER_TYPE.COURSES;

  private courses = () => {
    const courses = this.matchingCourses();
    let visibleCourses;
    if (this.isCoursesHidden()) {
      visibleCourses = this.hiddenCoursesHelper();
    } else {
      visibleCourses = courses;
    }
    return visibleCourses;
  }

  private matchingCourses = () => {
    const username = this.getUsername();
    if (username) {
      const allCourses = this.availableCourses();
      const matching: any = [];
      const { profile } = this.props;
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
    const { nonRetiredCourses } = this.props;
    if (nonRetiredCourses.length > 0) {
      const filtered = _.filter(nonRetiredCourses, (course) => {
        if (course.number === 'ICS 499') { // TODO: hardcoded ICS string
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
      if (this.isCoursesHidden()) {
        const { profile } = this.props;
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

  private opportunities = () => {
    const opportunities = this.matchingOpportunities();
    let visibleOpportunities;
    if (this.isOpportunitiesHidden()) {
      visibleOpportunities = this.hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    return visibleOpportunities;
  }

  private matchingOpportunities = () => {
    const allOpportunities = this.availableOpps();
    const matching: any = [];
    const { profile } = this.props;
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

  private availableOpps = () => {
    const { nonRetiredOpportunities } = this.props;
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    if (nonRetiredOpportunities.length > 0) {
      const filteredByTerm = _.filter(nonRetiredOpportunities, (opp) => {
        const oi = OpportunityInstances.find({
          studentID: this.getUserIdFromRoute(),
          opportunityID: opp._id,
        }).fetch();
        return oi.length === 0;
      });
      const ret = _.filter(filteredByTerm, (opp) => {
        let inFuture = false;
        _.forEach(opp.termIDs, (termID) => {
          const term = AcademicTerms.findDoc(termID);
          if (term.termNumber >= currentTerm.termNumber) {
            inFuture = true;
          }
        });
        return inFuture;
      });
      return ret;
    }
    return [];
  }

  private hiddenOpportunitiesHelper = () => {
    if (this.getUsername()) {
      const opportunities = this.matchingOpportunities();
      let nonHiddenOpportunities;
      if (this.isOpportunitiesHidden()) {
        const { profile } = this.props;
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    /*
     Had to declare the styles as React.CSSProperties to fix the "Type X is not assignable to Type Y" errors
     See https://github.com/microsoft/TypeScript/issues/11465#issuecomment-252453037
     */
    const uppercaseTextTransformStyle: React.CSSProperties = { textTransform: 'uppercase' };
    const cardsStackableStyle: React.CSSProperties = {
      maxHeight: '500px',
      overflowX: 'hidden',
      overflowY: 'scroll',
      marginTop: '10px',
    };

    const { type } = this.props;
    const hiddenExists = this.hiddenExists();
    const isCoursesHidden = this.isCoursesHidden();
    const isOpportunitiesHidden = this.isOpportunitiesHidden();
    const isTypeCourse = this.isTypeCourse();
    const courses = this.courses();
    const opportunities = this.opportunities();

    return (
      <Segment padded={true}>
        {/* Don't know why this particular <Header> is not accepting a boolean value of true for dividing, it's
        complaining that I should use the string "true" instead. Even then, the dividing line doesn't even appear. So I
        had to use the className attribute instead so it renders as "ui dividing header". - Gian */}
        <Header className="dividing">
          <h4>
            RECOMMENDED <span style={uppercaseTextTransformStyle}>{type}</span> <WidgetHeaderNumber
            inputValue={this.itemCount()}/>
          </h4>
        </Header>

        {
          hiddenExists ?
            [
              isTypeCourse ?
                [
                  isCoursesHidden ?
                    <Button key='one' basic={true} color="green" size="mini" onClick={this.handleShowHiddenCourses}>
                      <Icon name="chevron up"/> HIDDEN <span style={uppercaseTextTransformStyle}>COURSES</span>
                    </Button>
                    :
                    <Button key='two' basic={true} color="green" size="mini" onClick={this.handleHideHiddenCourses}>
                      <Icon name="chevron down"/> HIDDEN <span style={uppercaseTextTransformStyle}>COURSES</span>
                    </Button>,
                ]
                :
                [
                  isOpportunitiesHidden ?
                    <Button key='one' basic={true} color="green" size="mini"
                            onClick={this.handleShowHiddenOpportunities}>
                      <Icon name="chevron up"/> HIDDEN <span style={uppercaseTextTransformStyle}>OPPORTUNITIES</span>
                    </Button>
                    :
                    <Button key='two' basic={true} color="green" size="mini"
                            onClick={this.handleHideHiddenOpportunities}>
                      <Icon name="chevron down"/> HIDDEN <span style={uppercaseTextTransformStyle}>OPPORTUNITIES</span>
                    </Button>,
                ],
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

const StudentOfInterestWidgetCon = connect(mapStateToProps)(StudentOfInterestWidget);
const StudentOfInterestWidgetCont = withTracker(({ match }) => {
  /* Reactive sources to make Hiding a Course / Opportunity reactive */
  const username = match.params.username;
  const profile = Users.getProfile(username);
  const nonRetiredCourses = Courses.findNonRetired();
  const nonRetiredOpportunities = Opportunities.findNonRetired();

  /* Reactive sources to make StudentOfInterestAdd reactive */
  const courseInstances = CourseInstances.findNonRetired();
  const opportunityInstances = OpportunityInstances.findNonRetired();

  return {
    profile,
    nonRetiredCourses,
    nonRetiredOpportunities,
    courseInstances,
    opportunityInstances,
  };
})(StudentOfInterestWidgetCon);
const StudentOfInterestWidgetContainer = withRouter(StudentOfInterestWidgetCont);

export default StudentOfInterestWidgetContainer;
