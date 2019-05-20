import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { withRouter } from 'react-router-dom';
import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';
import * as _ from 'lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

interface IStudentOfInterestWidget {
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentOfInterestWidget extends React.Component<IStudentOfInterestWidget> {
  constructor(props) {
    super(props);
  }

  private itemCount = () => {
    let ret;
    if (this.props.type === 'courses') {
      ret = this.hiddenCoursesHelper().length;
    } else {
      ret = this.hiddenOpportunitiesHelper().length;
    }
    return ret;
  }

  private matchingCourses = () => {
    const username = this.props.match.params.username;
    if (username) {
      const allCourses = this.availableCourses();
      const matching: any = [];
      const profile = Users.getProfile(username);
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
          studentID: getUserIdFromRoute(),
          courseID: course._id,
        }).fetch();
        return ci.length === 0;
      });
      return filtered;
    }
    return [];
  }

  private hiddenCoursesHelper = () => {
    const username = this.props.match.params.username;
    if (username) {
      const courses = this.matchingCourses();
      let nonHiddenCourses;
      if (Template.instance().hidden.get()) {
        const profile = Users.getProfile(username);
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
    const username = this.props.match.params.username;
    if (username) {
      const opportunities = this.matchingOpportunities();
      let nonHiddenOpportunities;
      if (Template.instance().hidden.get()) {
        const profile = Users.getProfile(username);
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
    const username = this.props.match.params.username;
    const allOpportunities = this.availableOpps();
    const matching: any = [];
    const profile = Users.getProfile(username);
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
    const notRetired = Opportunities.findNonRetired({});
    const currentSemester = Semesters.getCurrentSemesterDoc();
    if (notRetired.length > 0) {
      const filteredBySem = _.filter(notRetired, (opp) => {
        const oi = OpportunityInstances.find({
          studentID: getUserIdFromRoute(),
          opportunityID: opp._id,
        }).fetch();
        return oi.length === 0;
      });
      return _.filter(filteredBySem, (opp) => {
        let inFuture = false;
        _.forEach(opp.semesterIDs, (semID) => {
          const sem = Semesters.findDoc(semID);
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
    const headerDividingStyle = { textTransform: 'uppercase' };

    return (
        <Segment padded={true}>
          <Header as="h4" dividng={true}>
            RECOMMENDED
            <span style={headerDividingStyle}>{this.props.type}</span> <WidgetHeaderNumber
              inputValue={this.itemCount()}/>
          </Header>
        </Segment>
    );
  }
}

export default withRouter(StudentOfInterestWidget);
