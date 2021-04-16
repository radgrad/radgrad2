import React from 'react';
import { Segment, Header, Menu, Tab } from 'semantic-ui-react';
import {
  Ice,
  CourseInstance,
  ProfileInterest,
  OpportunityInstance,
  ProfileCourse,
  ProfileOpportunity,
} from '../../../../typings/radgrad';
import TabIceCircle from '../../shared/TabIceCircle';
import { CompetencyIceTabPane } from './CompetencyIceTabPane';
import ExperienceIceTabPane from './ExperienceIceTabPane';
import InnovationIceTabPane from './InnovationIceTabPane';
import StudentIceColumn from './StudentIceColumn';
import PageIceCircle from './PageIceCircle';

/* Technical Debt:
 *   * L33: Consolidate type so it is consistently referred to as "Innovation".
 *   * L35: Pass in earnedICS and projectedICE to avoid redundant computation.
 */

export interface StudentIceWidgetProps {
  username: string;
  earnedICE: Ice;
  projectedICE: Ice;
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const StudentIceTabs: React.FC<StudentIceWidgetProps> = ({
  username,
  earnedICE,
  projectedICE,
  profileCourses,
  profileInterests,
  profileOpportunities,
  courseInstances,
  opportunityInstances,
}) => {
  const styleInfo: React.CSSProperties = { textAlign: 'left', paddingTop: 10 };
  const panes = [
    {
      menuItem: <Menu.Item key='innovation-tab'><TabIceCircle earned={earnedICE.i} planned={projectedICE.i}
                                                              type="innov" /> INNOVATION</Menu.Item>,
      render: () => (<InnovationIceTabPane username={username} profileInterests={profileInterests}
                                           profileOpportunities={profileOpportunities}
                                           opportunityInstances={opportunityInstances}
                                           projectedICE={projectedICE.i} earnedICE={earnedICE.i} />),
    },
    {
      menuItem: <Menu.Item key='competency-tab'><TabIceCircle earned={earnedICE.c} planned={projectedICE.c}
                                                              type="comp" /> COMPETENCY</Menu.Item>,
      render: () => (<CompetencyIceTabPane username={username} profileCourses={profileCourses} profileInterests={profileInterests} projectedICE={projectedICE.c} earnedICE={earnedICE.c} />),
    },
    {
      menuItem: <Menu.Item key='experience-tab'><TabIceCircle earned={earnedICE.e} planned={projectedICE.e}
                                                              type="exp" /> EXPERIENCE</Menu.Item>,
      render: () => (<ExperienceIceTabPane username={username} profileInterests={profileInterests}
                                           profileOpportunities={profileOpportunities}
                                           opportunityInstances={opportunityInstances}
                                           projectedICE={projectedICE.e} earnedICE={earnedICE.e} />),
    },
  ];
  return (
    <Tab panes={panes} />
  );
};

export default StudentIceTabs;
