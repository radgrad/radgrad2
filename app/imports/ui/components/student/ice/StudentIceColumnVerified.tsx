import React from 'react';
import { List } from 'semantic-ui-react';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { buildRouteName, getUserIdFromRoute } from '../../shared/utilities/router';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import { IAcademicTerm, IAcademicYearInstance, Ice, ICourseInstance, IOpportunityInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Users } from '../../../../api/user/UserCollection';

interface IStudentIceColumnVerifiedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  // eslint-disable-next-line react/no-unused-prop-types
  courseInstances: ICourseInstance[];
  // eslint-disable-next-line react/no-unused-prop-types
  opportunityInstances: IOpportunityInstance[];
}

const years = (props: IStudentIceColumnVerifiedProps, match): IAcademicYearInstance[] => {
  const studentID = getUserIdFromRoute(match);
  return AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
};

const academicTerms = (year: IAcademicYearInstance): IAcademicTerm[] => {
  const yearTerms = [];
  const termIDs = year.termIDs;
  _.forEach(termIDs, (termID) => {
    yearTerms.push(AcademicTerms.findDoc(termID));
  });
  return yearTerms;
};

const getEventsHelper = (iceType: string, type: string, earned: boolean, term: IAcademicTerm, props: IStudentIceColumnVerifiedProps, match): (IOpportunityInstance | ICourseInstance)[] => {
  if (getUserIdFromRoute(match)) {
    let allInstances: any[];
    const iceInstances = [];
    if (type === 'course') {
      allInstances = _.filter(props.courseInstances, (ci) => ci.verified === earned && ci.termID === term._id);
    } else {
      allInstances = _.filter(props.opportunityInstances, (oi) => oi.verified === earned && oi.termID === term._id);
    }
    allInstances.forEach((instance) => {
      if (iceType === 'Innovation') {
        if (instance.ice.i > 0) {
          iceInstances.push(instance);
        }
      } else if (iceType === 'Competency') {
        if (instance.ice.c > 0) {
          iceInstances.push(instance);
        }
      } else if (iceType === 'Experience') {
        if (instance.ice.e > 0) {
          iceInstances.push(instance);
        }
      }
    });
    return iceInstances;
  }
  return null;
};

const hasEvents = (earned: boolean, term: IAcademicTerm, props: IStudentIceColumnVerifiedProps, match): boolean => {
  let ret = false;
  if ((getEventsHelper(props.type, 'course', earned, term, props, match).length > 0) ||
    (getEventsHelper(props.type, 'opportunity', earned, term, props, match).length > 0)) {
    ret = true;
  }
  return ret;
};

const printTerm = (term: IAcademicTerm): string => AcademicTerms.toString(term._id, false);

const getEvents = (type: string, earned: boolean, term: IAcademicTerm, props: IStudentIceColumnVerifiedProps, match): (IOpportunityInstance | ICourseInstance)[] => getEventsHelper(props.type, type, earned, term, props, match);

const opportunityName = (opportunityInstance: IOpportunityInstance): string => {
  const opportunity = Opportunities.findDoc(opportunityInstance.opportunityID);
  return opportunity.name;
};

const courseName = (courseInstance: ICourseInstance): string => {
  const course = Courses.findDoc(courseInstance.courseID);
  return course.shortName;
};

const StudentIceColumnVerified = (props: IStudentIceColumnVerifiedProps) => {
  const match = useRouteMatch();
  const { type, earnedICEPoints, matchingPoints, getCourseSlug, getOpportunitySlug, icePoints } = props;
  return (
    <React.Fragment>
      {matchingPoints(earnedICEPoints, 0) ? (
        <p>
          You have no verified {type} points.
        </p>
        )
        : (
          <React.Fragment>
            <p>
              You have {earnedICEPoints} verified {type} points for the following:
            </p>
            <List relaxed="very">
              {years(props, match).map((year) => (
                academicTerms(year).map((term, index) => {
                  const opportunityEvents = getEvents('opportunity', true, term, props, match);
                  const courseEvents = getEvents('course', true, term, props, match);
                  const key = `${year._id}${index}`;
                  return (
                    <React.Fragment key={key}>
                      {hasEvents(true, term, props, match) ? (
                        <List.Item>
                          <List.Header>{printTerm(term)}</List.Header>
                          {opportunityEvents.map((event) => {
                            const opportunitySlug = getOpportunitySlug(event as IOpportunityInstance);
                            const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                            const points = icePoints(event.ice);
                            return (
                              <Link
                                key={`${opportunitySlug}-${route}-${points}-${opportunityName(event as IOpportunityInstance)}`}
                                to={route}
                              >
                                <b>+{points}</b> {opportunityName(event as IOpportunityInstance)}
                                <br />
                              </Link>
                            );
                          })}
                          {courseEvents.map((event) => {
                            const courseSlug = getCourseSlug(event);
                            const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${courseSlug}`);
                            const points = icePoints(event.ice);
                            return (
                              <Link
                                key={`${courseSlug}-${route}-${points}-${courseName(event as ICourseInstance)}`}
                                to={route}
                              >
                                <b>+{points}</b> {courseName(event as ICourseInstance)}
                                <br />
                              </Link>
                            );
                          })}
                        </List.Item>
                      ) : ''}
                    </React.Fragment>
                  );
                })
              ))}
            </List>
          </React.Fragment>
        )}
    </React.Fragment>
  );
};

const StudentIceColumnVerifiedContainer = withTracker(() => {
  const { username } = useParams();
  const studentID = Users.getProfile(username).userID;
  // Tracked to make StudentIceColumnVerified reactive
  const courseInstances: ICourseInstance[] = CourseInstances.findNonRetired({ studentID });
  const opportunityInstances: IOpportunityInstance[] = OpportunityInstances.findNonRetired({ studentID });
  return {
    courseInstances,
    opportunityInstances,
  };
})(StudentIceColumnVerified);

export default StudentIceColumnVerifiedContainer;
