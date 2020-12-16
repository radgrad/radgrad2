import React from 'react';
import { List } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { buildRouteName, getUserIdFromRoute } from '../../shared/utilities/router';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import { AcademicTerm, AcademicYearInstance, Ice, CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../../api/course/CourseCollection';

interface StudentIceColumnVerifiedProps {
  iceType: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
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

const getEventsHelper = (iceType: string, instanceType: 'course' | 'opportunity', earned: boolean, term: AcademicTerm, courseInstances: CourseInstance[], opportunityInstances: OpportunityInstance[], match): (OpportunityInstance | CourseInstance)[] => {
  if (getUserIdFromRoute(match)) {
    let allInstances: any[];
    const iceInstances = [];
    if (instanceType === 'course') {
      allInstances = _.filter(courseInstances, (ci) => ci.verified === earned && ci.termID === term._id);
    } else {
      allInstances = _.filter(opportunityInstances, (oi) => oi.verified === earned && oi.termID === term._id);
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
  if ((getEventsHelper(iceType, 'course', earned, term, courseInstances, opportunityInstances, match).length > 0) ||
    (getEventsHelper(iceType, 'opportunity', earned, term, courseInstances, opportunityInstances, match).length > 0)) {
    ret = true;
  }
  return ret;
};

const printTerm = (term: AcademicTerm): string => AcademicTerms.toString(term._id, false);

const getEvents = (instanceType: 'course' | 'opportunity', earned: boolean, term: AcademicTerm, iceType: 'Innovation' | 'Competency' | 'Experience', courseInstances: CourseInstance[], opportunityInstances: OpportunityInstance[], match): (OpportunityInstance | CourseInstance)[] => getEventsHelper(iceType, instanceType, earned, term, courseInstances, opportunityInstances, match);

const opportunityName = (opportunityInstance: OpportunityInstance): string => {
  const opportunity = Opportunities.findDoc(opportunityInstance.opportunityID);
  return opportunity.name;
};

const courseName = (courseInstance: CourseInstance): string => {
  const course = Courses.findDoc(courseInstance.courseID);
  return course.shortName;
};

const StudentIceColumnVerified: React.FC<StudentIceColumnVerifiedProps> = ({ iceType, earnedICEPoints, matchingPoints, getCourseSlug, getOpportunitySlug, icePoints, opportunityInstances, courseInstances }) => {
  const match = useRouteMatch();
  return (
    <React.Fragment>
      {matchingPoints(earnedICEPoints, 0) ? (
        <p>
          You have no verified {iceType} points.
        </p>
      )
        : (
          <React.Fragment>
            <p>
              You have {earnedICEPoints} verified {iceType} points for the following:
            </p>
            <List relaxed="very">
              {years(match).map((year) => (
                academicTerms(year).map((term, index) => {
                  const opportunityEvents = getEvents('opportunity', true, term, iceType, courseInstances, opportunityInstances, match);
                  const courseEvents = getEvents('course', true, term, iceType, courseInstances, opportunityInstances, match);
                  const key = `${year._id}${index}`;
                  return (
                    <React.Fragment key={key}>
                      {hasEvents(true, term, iceType, courseInstances, opportunityInstances, match) ? (
                        <List.Item>
                          <List.Header>{printTerm(term)}</List.Header>
                          {opportunityEvents.map((event) => {
                            const opportunitySlug = getOpportunitySlug(event as OpportunityInstance);
                            const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                            const points = icePoints(event.ice);
                            return (
                              <Link
                                key={`${opportunitySlug}-${route}-${points}-${opportunityName(event as OpportunityInstance)}`}
                                to={route}
                              >
                                <b>+{points}</b> {opportunityName(event as OpportunityInstance)}
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
                                key={`${courseSlug}-${route}-${points}-${courseName(event as CourseInstance)}`}
                                to={route}
                              >
                                <b>+{points}</b> {courseName(event as CourseInstance)}
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

export default StudentIceColumnVerified;
