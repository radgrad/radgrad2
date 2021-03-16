import React from 'react';
import { List } from 'semantic-ui-react';
import _ from 'lodash';
import { Link, useRouteMatch } from 'react-router-dom';
import { AcademicTerm, AcademicYearInstance, Ice, CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import { buildRouteName, getUserIdFromRoute } from '../../shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../../api/course/CourseCollection';

interface StudentIceColumnUnverifiedProps {
  iceType: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  remainingICEPoints: (earned: number, projected: number) => number;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const years = (match): AcademicYearInstance[] => {
  const studentID = getUserIdFromRoute(match);
  return AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
};

const academicTerms = (year: AcademicYearInstance): AcademicTerm[] => {
  const yearTerms = [];
  const termIDs = year.termIDs;
  _.forEach(termIDs, (termID) => {
    yearTerms.push(AcademicTerms.findDoc(termID));
  });
  return yearTerms;
};

const getEventsHelper = (
  iceType: 'Innovation' | 'Competency' | 'Experience',
  instanceType: 'course' | 'opportunity',
  earned: boolean,
  term: AcademicTerm,
  courseInstances: CourseInstance[],
  opportunityInstances: OpportunityInstance[],
  match,
): (OpportunityInstance | CourseInstance)[] => {
  if (getUserIdFromRoute(match)) {
    let allInstances: any[];
    const iceInstances = [];
    if (instanceType === 'course') {
      allInstances = courseInstances.filter((ci) => ci.verified === earned && ci.termID === term._id);
    } else {
      allInstances = opportunityInstances.filter((oi) => oi.verified === earned && oi.termID === term._id);
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

const hasEvents = (earned: boolean, term: AcademicTerm, iceType: 'Innovation' | 'Competency' | 'Experience', courseInstances: CourseInstance[], opportunityInstances: OpportunityInstance[], match): boolean => {
  let ret = false;
  if (getEventsHelper(iceType, 'course', earned, term, courseInstances, opportunityInstances, match).length > 0 || getEventsHelper(iceType, 'opportunity', earned, term, courseInstances, opportunityInstances, match).length > 0) {
    ret = true;
  }
  return ret;
};

const printTerm = (term: AcademicTerm): string => AcademicTerms.toString(term._id, false);

const getEvents = (
  instanceType: 'course' | 'opportunity',
  earned: boolean,
  term: AcademicTerm,
  iceType: 'Innovation' | 'Competency' | 'Experience',
  courseInstances: CourseInstance[],
  opportunityInstances: OpportunityInstance[],
  match,
): (OpportunityInstance | CourseInstance)[] => getEventsHelper(iceType, instanceType, earned, term, courseInstances, opportunityInstances, match);

const opportunityName = (opportunityInstance: OpportunityInstance): string => {
  const opportunity = Opportunities.findDoc(opportunityInstance.opportunityID);
  return opportunity.name;
};

const courseName = (courseInstance: CourseInstance): string => {
  const course = Courses.findDoc(courseInstance.courseID);
  return course.shortName;
};

const StudentIceColumnUnverified: React.FC<StudentIceColumnUnverifiedProps> = ({
  iceType,
  earnedICEPoints,
  projectedICEPoints,
  matchingPoints,
  getCourseSlug,
  getOpportunitySlug,
  icePoints,
  opportunityInstances,
  courseInstances,
  remainingICEPoints,
}) => {
  const match = useRouteMatch();

  const remainingPoints = remainingICEPoints(earnedICEPoints, projectedICEPoints);
  return (
    <React.Fragment>
      {matchingPoints(projectedICEPoints, 0) ? (
        <p>You have verified all of your planned points.</p>
      ) : (
        <React.Fragment>
          <p>
            You have a total of {remainingPoints} unverified {iceType} points.
          </p>
          <List relaxed="very">
            {years(match).map((year) =>
              academicTerms(year).map((term) => {
                const opportunityEvents = getEvents('opportunity', false, term, iceType, courseInstances, opportunityInstances, match);
                const courseEvents = getEvents('course', false, term, iceType, courseInstances, opportunityInstances, match);
                return (
                  <React.Fragment key={term._id}>
                    {hasEvents(false, term, iceType, courseInstances, opportunityInstances, match) ? (
                      <List.Item>
                        <List.Header>{printTerm(term)}</List.Header>
                        {opportunityEvents.map((event) => {
                          const opportunitySlug = getOpportunitySlug(event as OpportunityInstance);
                          const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                          const points = icePoints(event.ice);
                          const oName = opportunityName(event as OpportunityInstance);
                          return (
                            <Link key={`${opportunitySlug}-${route}-${points}-${oName}`} to={route}>
                              <b>+{points}</b> {oName}
                              <br />
                            </Link>
                          );
                        })}
                        {courseEvents.map((event) => {
                          const courseSlug = getCourseSlug(event);
                          const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${courseSlug}`);
                          const points = icePoints(event.ice);
                          const cName = courseName(event as CourseInstance);
                          return (
                            <Link key={`${courseSlug}-${route}-${points}-${cName}`} to={route}>
                              <b>+{points}</b> {cName}
                              <br />
                            </Link>
                          );
                        })}
                      </List.Item>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                );
              }),
            )}
          </List>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default StudentIceColumnUnverified;
