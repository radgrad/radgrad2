import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import * as Router from '../../shared/utilities/router';
import StudentIceColumnVerified from './StudentIceColumnVerified';
import StudentIceColumnUnverified from './StudentIceColumnUnverified';
import StudentIceColumnRecommended from './StudentIceColumnRecommended';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Ice, ICourseInstance, IFavoriteInterest, IOpportunityInstance, IceType } from '../../../../typings/radgrad';

export interface IStudentIceColumnProps {
  // TODO make this an exported enum in radgrad.d.ts
  type: IceType;
  favoriteInterests: IFavoriteInterest[];
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}
const StudentIceColumn: React.FC<IStudentIceColumnProps> = ({ type, favoriteInterests, courseInstances, opportunityInstances }) => {
  const match = useRouteMatch();
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

  const getVerifiedColor = (): string => {
    switch (type) {
      case IceType.innovation:
        return 'ice-innovation-color';
      case IceType.competency:
        return 'ice-competency-color';
      case IceType.experience:
        return 'ice-experience-color';
      default:
        return '';
    }
  };

  // TODO add documentation for this and the above function
  const getUnverifiedColor = (): string => {
    switch (type) {
      case IceType.innovation:
        return 'ice-innovation-proj-color';
      case IceType.competency:
        return 'ice-competency-proj-color';
      case IceType.experience:
        return 'ice-experience-proj-color';
      default:
        return '';
    }
  };

  const getPoints = (ice: Ice): number => {
    let ret;
    if (type === IceType.innovation) {
      ret = ice.i;
    } else if (type === IceType.competency) {
      ret = ice.c;
    } else if (type === IceType.experience) {
      ret = ice.e;
    }
    return ret;
  };

  const remainingICEPoints = (earned: number, projected: number): number => projected - earned;

  const matchingPoints = (a: number, b: number): boolean => a <= b;

  const icePoints = (ice: Ice): number => {
    let ret;
    if (type === IceType.innovation) {
      ret = ice.i;
    } else if (type === IceType.competency) {
      ret = ice.c;
    } else if (type === IceType.experience) {
      ret = ice.e;
    }
    return ret;
  };

  const getCourseSlug = (course) => {
    // TODO if typeof course is ICourse else if ... else.
    //  type course as ICourse | ICourseInstance
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

  // TODO don't need this if pass in earnedICE and projectedICE
  const username = Router.getUsername(match);
  const earnedICE = StudentProfiles.getEarnedICE(username);
  const projectedICE = StudentProfiles.getProjectedICE(username);
  const earnedICEPoints = getPoints(earnedICE);
  const projectedICEPoints = getPoints(projectedICE);
  const unverifiedICEPoints = remainingICEPoints(earnedICEPoints, projectedICEPoints);

  return (
    <Accordion styled fluid exclusive={false}>
      <Accordion.Title active={verifiedColumnOpenState} onClick={handleVerifiedColumnClick}>
        <Icon name="dropdown" />
        Verified
        <div className={`ui right floated ${verifiedColor}`}>
          {earnedICEPoints} pts
        </div>
      </Accordion.Title>
      <Accordion.Content active={verifiedColumnOpenState}>
        <StudentIceColumnVerified
          type={type}
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
          type={type}
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
          favoriteInterests={favoriteInterests}
        />
      </Accordion.Content>
    </Accordion>
  );
};

export default StudentIceColumn;
