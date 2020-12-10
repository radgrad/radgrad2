import React from 'react';
import { List } from 'semantic-ui-react';
import _ from 'lodash';
import { Link, useRouteMatch } from 'react-router-dom';
import { IAcademicTerm, IAcademicYearInstance, Ice, ICourseInstance, IOpportunityInstance } from '../../../../typings/radgrad';
import { buildRouteName, getUserIdFromRoute } from '../../shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../../api/course/CourseCollection';

interface IStudentIceColumnUnverifiedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  remainingICEPoints: (earned: number, projected: number) => number;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  // eslint-disable-next-line react/no-unused-prop-types
  courseInstances: ICourseInstance[];
  // eslint-disable-next-line react/no-unused-prop-types
  opportunityInstances: IOpportunityInstance[];
}

const years = (props: IStudentIceColumnUnverifiedProps, match): IAcademicYearInstance[] => {
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

const getEventsHelper = (iceType: string, type: string, earned: boolean, term: IAcademicTerm, props: IStudentIceColumnUnverifiedProps, match): (IOpportunityInstance | ICourseInstance)[] => {
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

const hasEvents = (earned: boolean, term: IAcademicTerm, props: IStudentIceColumnUnverifiedProps, match): boolean => {
  let ret = false;
  if ((getEventsHelper(props.type, 'course', earned, term, props, match).length > 0) ||
    (getEventsHelper(props.type, 'opportunity', earned, term, props, match).length > 0)) {
    ret = true;
  }
  return ret;
};

const printTerm = (term: IAcademicTerm): string => AcademicTerms.toString(term._id, false);

const getEvents = (type: string, earned: boolean, term: IAcademicTerm, props: IStudentIceColumnUnverifiedProps, match): (IOpportunityInstance | ICourseInstance)[] => getEventsHelper(props.type, type, earned, term, props, match);

const opportunityName = (opportunityInstance: IOpportunityInstance): string => {
  const opportunity = Opportunities.findDoc(opportunityInstance.opportunityID);
  return opportunity.name;
};

const courseName = (courseInstance: ICourseInstance): string => {
  const course = Courses.findDoc(courseInstance.courseID);
  return course.shortName;
};

const StudentIceColumnUnverified: React.FC<IStudentIceColumnUnverifiedProps> = (props) => {
  const match = useRouteMatch();
  const { type, earnedICEPoints, projectedICEPoints, matchingPoints, getCourseSlug, getOpportunitySlug, icePoints } = props;

  const remainingPoints = props.remainingICEPoints(earnedICEPoints, projectedICEPoints);
  return (
    <React.Fragment>
      {matchingPoints(projectedICEPoints, 0) ?
        <p>You have verified all of your planned points.</p>
        : (
          <React.Fragment>
            <p>
              You have a total of {remainingPoints} unverified {type} points.
            </p>
            <List relaxed="very">
              {years(props, match).map((year) => (
                academicTerms(year).map((term) => {
                  const opportunityEvents = getEvents('opportunity', false, term, props, match);
                  const courseEvents = getEvents('course', false, term, props, match);
                  return (
                    <React.Fragment key={term._id}>
                      {hasEvents(false, term, props, match) ? (
                        <List.Item>
                          <List.Header>{printTerm(term)}</List.Header>
                          {opportunityEvents.map((event) => {
                            const opportunitySlug = getOpportunitySlug(event as IOpportunityInstance);
                            const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                            const points = icePoints(event.ice);
                            const oName = opportunityName(event as IOpportunityInstance);
                            return (
                              <Link
                                key={`${opportunitySlug}-${route}-${points}-${oName}`}
                                to={route}
                              >
                                <b>+{points}</b> {oName}
                                <br />
                              </Link>
                            );
                          })}
                          {courseEvents.map((event) => {
                            const courseSlug = getCourseSlug(event);
                            const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${courseSlug}`);
                            const points = icePoints(event.ice);
                            const cName = courseName(event as ICourseInstance);
                            return (
                              <Link
                                key={`${courseSlug}-${route}-${points}-${cName}`}
                                to={route}
                              >
                                <b>+{points}</b> {cName}
                                <br />
                              </Link>
                            );
                          })}
                        </List.Item>
                      ) : ''}
                    </React.Fragment>
                  );
                })))}
            </List>
          </React.Fragment>
        )}
    </React.Fragment>
  );
};

export default StudentIceColumnUnverified;
