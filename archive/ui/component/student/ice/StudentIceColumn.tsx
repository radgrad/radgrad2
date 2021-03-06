import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import StudentIceColumnVerified from './StudentIceColumnVerified';
import StudentIceColumnUnverified from './StudentIceColumnUnverified';
import StudentIceColumnRecommended from './StudentIceColumnRecommended';
import { Slugs } from '../../../../../app/imports/api/slug/SlugCollection';
import { Courses } from '../../../../../app/imports/api/course/CourseCollection';
import { Opportunities } from '../../../../../app/imports/api/opportunity/OpportunityCollection';
import { Ice, CourseInstance, ProfileInterest, OpportunityInstance, ICEType } from '../../../../../app/imports/typings/radgrad';

/* Technical Debt
 *   * Improve typing of getCourseSlug:  if typeof course is ICourse else if ... else
 *     type course as ICourse | ICourseInstance
 *
 */

export interface StudentIceColumnProps {
  type: ICEType;
  profileInterests: ProfileInterest[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: Ice;
  earnedICE: Ice;
}

const StudentIceColumn: React.FC<StudentIceColumnProps> = ({ type, profileInterests, courseInstances, opportunityInstances, projectedICE, earnedICE }) => {
  const [verifiedColumnOpenState, setVerifiedColumnOpen] = useState(true);
  const [unVerifiedColumnOpenState, setUnVerifiedColumnOpen] = useState(false);
  const [recommendedColumnOpenState, setRecommendedColumnOpen] = useState(false);

  const handleVerifiedColumnClick = (e): void => {
    e.preventDefault();
    setVerifiedColumnOpen(!verifiedColumnOpenState);
  };

  const handleUnVerifiedColumnClick = (e): void => {
    e.preventDefault();
    setUnVerifiedColumnOpen(!unVerifiedColumnOpenState);
  };

  const handleRecommendedColumnClick = (e): void => {
    e.preventDefault();
    setRecommendedColumnOpen(!recommendedColumnOpenState);
  };

  // returns the CSS name of a color found in app/public/semantic.min.css depending on the color the widget should be
  const getVerifiedColor = (): string => {
    switch (type) {
      case 'Innovation':
        return 'ice-innovation-color';
      case 'Competency':
        return 'ice-competency-color';
      case 'Experience':
        return 'ice-experience-color';
      default:
        return '';
    }
  };

  // returns the CSS name of a color found in app/public/semantic.min.css depending on the color the widget should be
  // -proj colors are slightly lighter colors of the same shade.
  const getUnverifiedColor = (): string => {
    switch (type) {
      case 'Innovation':
        return 'ice-innovation-proj-color';
      case 'Competency':
        return 'ice-competency-proj-color';
      case 'Experience':
        return 'ice-experience-proj-color';
      default:
        return '';
    }
  };

  const getPoints = (ice: Ice): number => {
    let ret;
    if (type === 'Innovation') {
      ret = ice.i;
    } else if (type === 'Competency') {
      ret = ice.c;
    } else if (type === 'Experience') {
      ret = ice.e;
    }
    return ret;
  };

  const remainingICEPoints = (earned: number, projected: number): number => projected - earned;

  const matchingPoints = (a: number, b: number): boolean => a <= b;

  const icePoints = (ice: Ice): number => {
    let ret;
    if (type === 'Innovation') {
      ret = ice.i;
    } else if (type === 'Competency') {
      ret = ice.c;
    } else if (type === 'Experience') {
      ret = ice.e;
    }
    return ret;
  };

  const getCourseSlug = (course) => {
    if (course.courseID) {
      return Slugs.findDoc(Courses.findDoc(course.courseID).slugID).name;
    }
    return Slugs.findDoc(course.slugID).name;
  };

  const getOpportunitySlug = (opportunity): string => {
    if (opportunity.opportunityID) {
      return Slugs.findDoc(Opportunities.findDoc(opportunity.opportunityID).slugID).name;
    }
    return Slugs.findDoc(opportunity.slugID).name;
  };

  const verifiedColor = getVerifiedColor();
  const unverifiedColor = getUnverifiedColor();

  const earnedICEPoints = getPoints(earnedICE);
  const projectedICEPoints = getPoints(projectedICE);
  const unverifiedICEPoints = remainingICEPoints(earnedICEPoints, projectedICEPoints);

  return (
    <Accordion styled fluid exclusive={false}>
      <Accordion.Title active={verifiedColumnOpenState} onClick={handleVerifiedColumnClick}>
        <Icon name="dropdown" />
        Verified
        <div className={`ui right floated ${verifiedColor}`}>{earnedICEPoints} pts</div>
      </Accordion.Title>
      <Accordion.Content active={verifiedColumnOpenState}>
        <StudentIceColumnVerified
          iceType={type}
          earnedICEPoints={earnedICEPoints}
          getCourseSlug={getCourseSlug}
          matchingPoints={matchingPoints}
          getOpportunitySlug={getOpportunitySlug}
          icePoints={icePoints}
          courseInstances={courseInstances}
          opportunityInstances={opportunityInstances}
        />
      </Accordion.Content>

      <Accordion.Title active={unVerifiedColumnOpenState} onClick={handleUnVerifiedColumnClick}>
        <Icon name="dropdown" />
        Unverified
        <div className={`ui right floated ${unverifiedColor}`}>{unverifiedICEPoints} pts</div>
      </Accordion.Title>
      <Accordion.Content active={unVerifiedColumnOpenState}>
        <StudentIceColumnUnverified
          iceType={type}
          earnedICEPoints={earnedICEPoints}
          icePoints={icePoints}
          projectedICEPoints={projectedICEPoints}
          getCourseSlug={getCourseSlug}
          matchingPoints={matchingPoints}
          getOpportunitySlug={getOpportunitySlug}
          remainingICEPoints={remainingICEPoints}
          courseInstances={courseInstances}
          opportunityInstances={opportunityInstances}
        />
      </Accordion.Content>

      <Accordion.Title active={recommendedColumnOpenState} onClick={handleRecommendedColumnClick}>
        <Icon name="dropdown" />
        Get to 100
      </Accordion.Title>
      <Accordion.Content active={recommendedColumnOpenState}>
        <StudentIceColumnRecommended
          type={type}
          earnedICEPoints={earnedICEPoints}
          getCourseSlug={getCourseSlug}
          projectedICEPoints={projectedICEPoints}
          matchingPoints={matchingPoints}
          icePoints={icePoints}
          getOpportunitySlug={getOpportunitySlug}
          profileInterests={profileInterests}
        />
      </Accordion.Content>
    </Accordion>
  );
};

export default StudentIceColumn;
