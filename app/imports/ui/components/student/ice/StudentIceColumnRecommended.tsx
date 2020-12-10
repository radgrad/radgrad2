import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import _ from 'lodash';
import { buildRouteName, getUserIdFromRoute } from '../../shared/utilities/router';
import { Ice, ICourse, IFavoriteInterest, IOpportunity } from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Courses } from '../../../../api/course/CourseCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { FavoriteInterests } from '../../../../api/favorite/FavoriteInterestCollection';

interface IStudentIceColumnRecommendedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  favoriteInterests: IFavoriteInterest[];
}

const hasNoInterests = (props: IStudentIceColumnRecommendedProps, match): boolean => {
  const userID = getUserIdFromRoute(match);
  const interests = FavoriteInterests.findNonRetired({ userID });
  return interests.length === 0;
};

const availableCourses = (props: IStudentIceColumnRecommendedProps, match): ICourse[] => {
  const courses = Courses.findNonRetired({});
  if (courses.length > 0) {
    return _.filter(courses, (course) => {
      if (course.num === 'ICS 499') { // TODO: hardcoded ICS string
        return true;
      }
      const ci = CourseInstances.findNonRetired({
        studentID: getUserIdFromRoute(match),
        courseID: course._id,
      });
      return ci.length === 0;
    });
  }
  return [];
};

const matchingOpportunities = (props: IStudentIceColumnRecommendedProps, match): IOpportunity[] => {
  const { favoriteInterests } = props;
  const allOpportunities = Opportunities.findNonRetired();
  const matching = [];
  const userInterests = [];
  _.forEach(favoriteInterests, (f) => {
    userInterests.push(Interests.findDoc(f.interestID));
  });
  let opportunityInterests = [];
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
};

const matchingCourses = (props: IStudentIceColumnRecommendedProps, match): ICourse[] => {
  const { favoriteInterests } = props;
  const allCourses: ICourse[] = availableCourses(props, match);
  const matching: ICourse[] = [];
  const userInterests = [];
  _.forEach(favoriteInterests, (f) => {
    userInterests.push(Interests.findDoc(f.interestID));
  });
  let courseInterests = [];
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
};

const recommendedEvents = (projectedPoints: number, props: IStudentIceColumnRecommendedProps, match): any[] => {
  const { type } = props;
  if (getUserIdFromRoute(match)) {
    let allInstances: any[];
    const recommendedInstances = [];
    let totalIce = 0;
    const remainder = 100 - projectedPoints;
    if (type === 'Competency') {
      allInstances = matchingCourses(props, match);
    } else {
      allInstances = matchingOpportunities(props, match);
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

const StudentIceColumnRecommended: React.FC<IStudentIceColumnRecommendedProps> = (props) => {
  const match = useRouteMatch();
  const { type, earnedICEPoints, projectedICEPoints, matchingPoints, getCourseSlug, getOpportunitySlug, icePoints } = props;

  return (
    <React.Fragment>
      {matchingPoints(100, earnedICEPoints) ? (
        <p>
          Congratulations! You have 100 (or more) verified {type} points!
        </p>
      )
        :
        matchingPoints(100, projectedICEPoints) ? (
          <p>
            You already have at least 100 verified or unverified {type} points.
          </p>
        )
          :
          hasNoInterests(props, match) ?
            <p>Consider adding interests to see recommendations here.</p>
            : (
              <React.Fragment>
                <p>
                  Consider the following to acquire 100 {type} points.
                </p>
                <List>
                  {recommendedEvents(projectedICEPoints, props, match).map((event) => {
                    const courseSlug = getCourseSlug(event);
                    const courseRoute = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${courseSlug}`);
                    const opportunitySlug = getOpportunitySlug(event);
                    const opportunityRoute = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                    return (
                      <List.Item key={event._id}>
                        {type === 'Competency' ? (
                          <Link to={courseRoute}>
                            <b>+9</b> {event.shortName}
                          </Link>
                        )
                          : (
                            <Link to={opportunityRoute}>
                              <b>+{icePoints(event.ice)}</b> {event.name}
                            </Link>
                          )}
                      </List.Item>
                    );
                  })}
                </List>
              </React.Fragment>
            )}
    </React.Fragment>
  );
};

export default StudentIceColumnRecommended;
