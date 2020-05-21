import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as Router from '../shared/RouterHelperFunctions';
import StudentIceColumnVerified from './StudentIceColumnVerified';
import StudentIceColumnUnverified from './StudentIceColumnUnverified';
import StudentIceColumnRecommended from './StudentIceColumnRecommended';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Ice } from '../../../typings/radgrad';

interface IStudentIceColumnProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
  type: 'Innovation' | 'Competency' | 'Experience';
}

const StudentIceColumn = (props: IStudentIceColumnProps) => {
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
    const { type } = props;
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

  const getUnverifiedColor = (): string => {
    const { type } = props;
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
    const { type } = props;
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
    const { type } = props;
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

  const { type } = props;
  const verifiedColor = getVerifiedColor();
  const unverifiedColor = getUnverifiedColor();

  const username = Router.getUsername(props.match);
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
        />
      </Accordion.Content>
    </Accordion>
  );
};

export default withRouter(StudentIceColumn);
