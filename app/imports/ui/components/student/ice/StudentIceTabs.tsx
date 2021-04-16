import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
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

/* Technical Debt:
 *   * L33: Consolidate type so it is consistently referred to as "Innovation".
 *   * L35: Pass in earnedICE and projectedICE to avoid redundant computation.
 */

export interface StudentIceWidgetProps {
  username: string;
  profileID: string;
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
  profileID,
  earnedICE,
  projectedICE,
  profileCourses,
  profileInterests,
  profileOpportunities,
  courseInstances,
  opportunityInstances,
}) => {
  const panes = [
    {
      menuItem: <Menu.Item key='innovation-tab'><TabIceCircle earned={earnedICE.i} planned={projectedICE.i}
                                                              type="innov" /> INNOVATION</Menu.Item>,
      render: () => (<InnovationIceTabPane username={username} profileID={profileID} profileInterests={profileInterests}
                                           profileOpportunities={profileOpportunities}
                                           opportunityInstances={opportunityInstances}
                                           projectedICE={projectedICE.i} earnedICE={earnedICE.i} />),
    },
    {
      menuItem: <Menu.Item key='competency-tab'><TabIceCircle earned={earnedICE.c} planned={projectedICE.c}
                                                              type="comp" /> COMPETENCY</Menu.Item>,
      render: () => (
        <CompetencyIceTabPane profileID={profileID} profileCourses={profileCourses} profileInterests={profileInterests}
                              projectedICE={projectedICE.c} earnedICE={earnedICE.c} />),
    },
    {
      menuItem: <Menu.Item key='experience-tab'><TabIceCircle earned={earnedICE.e} planned={projectedICE.e}
                                                              type="exp" /> EXPERIENCE</Menu.Item>,
      render: () => (<ExperienceIceTabPane username={username} profileID={profileID} profileInterests={profileInterests}
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
