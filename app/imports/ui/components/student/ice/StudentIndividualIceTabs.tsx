import _ from 'lodash';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { Grid, Tab } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { gradeCompetency } from '../../../../api/ice/IceProcessor';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import {
  Course,
  CourseInstance,
  Ice,
  ICEType, Opportunity,
  OpportunityInstance, ProfileCourse,
  ProfileInterest, ProfileOpportunity,
} from '../../../../typings/radgrad';
import { getUserIdFromRoute } from '../../shared/utilities/router';
import StudentUnverifiedOpportunityItem from '../verification-requests/StudentUnverifiedOpportunityItem';
import StudentVerifiedOpportunityItem from '../verification-requests/StudentVerifiedOpportunityItem';

interface StudentIndividualIceTabsProps {
  type: ICEType;
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: Ice;
  earnedICE: Ice;
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

const StudentIndividualIceTabs: React.FC<StudentIndividualIceTabsProps> = ({ type, profileCourses, profileInterests, profileOpportunities, projectedICE, earnedICE, courseInstances, opportunityInstances }) => {
  const verifiedCIs = courseInstances.filter((ci) => ci.verified);
  const unVerifiedCIs = courseInstances.filter((ci) => !ci.verified);
  const verifiedOIs = opportunityInstances.filter((oi) => oi.verified);
  let unVerifiedOIs = opportunityInstances.filter((oi) => !oi.verified);
  const currentAcademicTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  unVerifiedOIs = unVerifiedOIs.filter((oi) => AcademicTerms.findDoc(oi.termID).termNumber < currentAcademicTermNum);
  const match = useRouteMatch();
  const panes = [
    {
      menuItem: 'GET TO 100',
      render: () => {
        let earned = earnedICE.i;
        let projected: number = projectedICE.i;
        switch (type) {
          case 'Competency':
            earned = earnedICE.c;
            projected = projectedICE.c;
            break;
          case 'Experience':
            earned = earnedICE.e;
            projected = projectedICE.e;
            break;
        }
        let fragment: JSX.Element;
        if (earned >= 100) {
          fragment = <p>Congratulations! You have 100 (or more) verified {type} points!</p>;
        } else if (projected >= 100) {
          fragment = <p>You already have at least 100 verified or unverified {type} points.</p>;
        } else if (profileInterests.length === 0) {
          fragment = <p>Consider adding interests to see recommendations here.</p>;
        } else {
          fragment = <React.Fragment>
            {recommendedEvents(projected, profileInterests, type, match).map((oi) => oi.name)}
          </React.Fragment>;
        }
        return (
          fragment
        );
      },
    },
    {
      menuItem: 'UNVERIFIED',
      render: () => {
        switch (type) {
          case 'Innovation':
            return (<Grid stackable>
              {unVerifiedOIs.map((oi) => <StudentUnverifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
            </Grid>);
          case 'Competency':
            return (<Grid stackable />);
          case 'Experience':
            return (<Grid stackable>
              {unVerifiedOIs.map((oi) => <StudentUnverifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
            </Grid>);
        }
        return '';
      },
    },
    {
      menuItem: 'VERIFIED',
      render: () => (
          <Grid stackable>
            {verifiedOIs.map((oi) => <StudentVerifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
          </Grid>),
    },
  ];
  return <Tab panes={panes} />;
};

export default StudentIndividualIceTabs;
