import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { buildRouteName, getUserIdFromRoute, getUsername } from '../shared/RouterHelperFunctions';
import { Interests } from '../../../api/interest/InterestCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Ice, ICourse, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';

interface IStudentIceColumnRecommendedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const hasNoInterests = (props: IStudentIceColumnRecommendedProps): boolean => {
  const user = Users.getProfile(getUsername(props.match));
  return user.interestIDs.length === 0;
};

const recommendedEvents = (projectedPoints: number, props: IStudentIceColumnRecommendedProps): any[] => {
  const { type } = props;
  if (getUserIdFromRoute(props.match)) {
    let allInstances = [];
    const recommendedInstances = [];
    let totalIce = 0;
    const remainder = 100 - projectedPoints;
    if (type === 'Competency') {
      allInstances = this.matchingCourses();
    } else {
      allInstances = this.matchingOpportunities();
    }

    if (type === 'Innovation') {
      allInstances.forEach((instance) => {
        if (totalIce < remainder) {
          if (instance.ice.i > 0) {
            totalIce += instance.ice.i;
            recommendedInstances.push(instance);
          }
        }
      });
    } else if (type === 'Competency') {
      allInstances.forEach((instance) => {
        if (totalIce < remainder) {
          totalIce += 9; // assume A grade
          recommendedInstances.push(instance);
        }
      });
    } else if (type === 'Experience') {
      allInstances.forEach((instance) => {
        if (totalIce < remainder) {
          if (instance.ice.e > 0) {
            totalIce += instance.ice.e;
            recommendedInstances.push(instance);
          }
        }
      });
    } else {
      return null;
    }
    return recommendedInstances;
  }
  return null;
};

const availableCourses = (): ICourse[] => {
  const courses = Courses.findNonRetired({});
  if (courses.length > 0) {
    const filtered = _.filter(courses, (course) => {
      if (course.number === 'ICS 499') { // TODO: hardcoded ICS string
        return true;
      }
      const ci = CourseInstances.findNonRetired({
        studentID: getUserIdFromRoute(this.props.match),
        courseID: course._id,
      });
      return ci.length === 0;
    });
    return filtered;
  }
  return [];
};


class StudentIceColumnRecommended extends React.Component<IStudentIceColumnRecommendedProps> {
  constructor(props) {
    super(props);
  }

  private matchingOpportunities = (): IOpportunity[] => {
    const allOpportunities = Opportunities.findNonRetired();
    const matching = [];
    const profile = Users.getProfile(getUsername(this.props.match));
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
    return matching;
  }

  private matchingCourses = (): ICourse[] => {
    const allCourses = availableCourses();
    const matching = [];
    const profile = Users.getProfile(getUsername(this.props.match));
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
    return matching;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { type, earnedICEPoints, projectedICEPoints, matchingPoints, getCourseSlug, getOpportunitySlug, icePoints, match } = this.props;

    return (
      <React.Fragment>
        {matchingPoints(100, earnedICEPoints) ?
          <p>Congratulations! You have 100 (or more) verified {type} points!</p>
          :
          matchingPoints(100, projectedICEPoints) ?
            <p>You already have at least 100 verified or unverified {type} points.</p>
            :
            hasNoInterests(this.props) ?
              <p>Consider adding interests to see recommendations here.</p>
              :
              <React.Fragment>
                <p>Consider the following to acquire 100 {type} points.</p>
                <List>
                  {recommendedEvents(projectedICEPoints, this.props).map((event) => {
                    const courseSlug = getCourseSlug(event);
                    const courseRoute = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${courseSlug}`);
                    const opportunitySlug = getOpportunitySlug(event);
                    const opportunityRoute = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                    return (
                      <List.Item key={event._id}>
                        {type === 'Competency' ?
                          <Link to={courseRoute}><b>+9</b> {event.shortName}</Link>
                          :
                          <Link to={opportunityRoute}><b>+{icePoints(event.ice)}</b> {event.name}</Link>
                        }
                      </List.Item>
                    );
                  })}
                </List>
              </React.Fragment>}
      </React.Fragment>
    );
  }
}

export default withRouter(StudentIceColumnRecommended);
