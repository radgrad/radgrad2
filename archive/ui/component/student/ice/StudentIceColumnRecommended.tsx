import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import _ from 'lodash';
import { gradeCompetency } from '../../../../../app/imports/api/ice/IceProcessor';
import { buildRouteName, getUserIdFromRoute } from '../../../../../app/imports/ui/components/shared/utilities/router';
import { Ice, Course, ProfileInterest, Opportunity, ICEType } from '../../../../../app/imports/typings/radgrad';
import { EXPLORER_TYPE } from '../../../../../app/imports/ui/layouts/utilities/route-constants';
import { Courses } from '../../../../../app/imports/api/course/CourseCollection';
import { CourseInstances } from '../../../../../app/imports/api/course/CourseInstanceCollection';
import { Opportunities } from '../../../../../app/imports/api/opportunity/OpportunityCollection';
import { Interests } from '../../../../../app/imports/api/interest/InterestCollection';

interface StudentIceColumnRecommendedProps {
  type: ICEType;
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  profileInterests: ProfileInterest[];
}

const hasNoInterests = (profileInterests: ProfileInterest[]): boolean => profileInterests.length === 0;

const availableCourses = (match): Course[] => {
  const courses = Courses.findNonRetired({});
  return courses.filter((course) => {
    if (Meteor.settings.public.repeatableCourseNums.includes(course.num)) {
      return true;
    }
    const ci = CourseInstances.findNonRetired({
      studentID: getUserIdFromRoute(match),
      courseID: course._id,
    });
    return ci.length === 0;
  });
};

const matchingOpportunities = (profileInterests: ProfileInterest[]): Opportunity[] => {
  const allOpportunities = Opportunities.findNonRetired();
  const matching = [];
  const userInterests = [];
  profileInterests.forEach((f) => {
    userInterests.push(Interests.findDoc(f.interestID));
  });
  let opportunityInterests = [];
  // TODO this looks very inefficient. Is there a better way?
  allOpportunities.forEach((opp) => {
    opportunityInterests = [];
    opp.interestIDs.forEach((id) => {
      opportunityInterests.push(Interests.findDoc(id));
      opportunityInterests.forEach((oppInterest) => {
        userInterests.forEach((userInterest) => {
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

const matchingCourses = (profileInterests: ProfileInterest[], match): Course[] => {
  const allCourses: Course[] = availableCourses(match);
  const matching: Course[] = [];
  const userInterests = [];
  profileInterests.forEach((f) => {
    userInterests.push(Interests.findDoc(f.interestID));
  });
  let courseInterests = [];
  // TODO this looks bad.
  allCourses.forEach((course) => {
    courseInterests = [];
    course.interestIDs.forEach((id) => {
      courseInterests.push(Interests.findDoc(id));
      courseInterests.forEach((courseInterest) => {
        userInterests.forEach((userInterest) => {
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

const recommendedEvents = (projectedPoints: number, profileInterests: ProfileInterest[], type, match): any[] => {
  if (getUserIdFromRoute(match)) {
    let allInstances: any[];
    const recommendedInstances = [];
    let totalIce = 0;
    const remainder = 100 - projectedPoints;
    if (type === 'Competency') {
      allInstances = matchingCourses(profileInterests, match);
    } else {
      allInstances = matchingOpportunities(profileInterests);
    }
    switch (type) {
      case 'Innovation':
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            if (instance.ice.i > 0) {
              totalIce += instance.ice.i;
              recommendedInstances.push(instance);
            }
          }
        });
        break;
      case 'Competency':
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            totalIce += gradeCompetency.A; // assume A grade
            recommendedInstances.push(instance);
          }
        });
        break;
      case 'Experience':
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            if (instance.ice.e > 0) {
              totalIce += instance.ice.e;
              recommendedInstances.push(instance);
            }
          }
        });
    }
    // console.log(recommendedInstances);
    return recommendedInstances;
  }
  return null;
};

const StudentIceColumnRecommended: React.FC<StudentIceColumnRecommendedProps> = ({
  earnedICEPoints,
  type,
  profileInterests,
  getCourseSlug,
  getOpportunitySlug,
  icePoints,
  matchingPoints,
  projectedICEPoints,
}) => {
  const match = useRouteMatch();

  return (
    <React.Fragment>
      {matchingPoints(100, earnedICEPoints) ? (
        <p>Congratulations! You have 100 (or more) verified {type} points!</p>
      ) : matchingPoints(100, projectedICEPoints) ? (
        <p>You already have at least 100 verified or unverified {type} points.</p>
      ) : hasNoInterests(profileInterests) ? (
        <p>Consider adding interests to see recommendations here.</p>
      ) : (
        <React.Fragment>
          <p>Consider the following to acquire 100 {type} points.</p>
          <List>
            {recommendedEvents(projectedICEPoints, profileInterests, type, match).map((event) => {
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
                  ) : (
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
