import React from 'react';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { DegreePlannerStateNames } from '../../../pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../utilities/StickyState';
import ProfileOpportunities from './ProfileOpportunities';
import ProfileCourses from './ProfileCourses';
import DepDetailsWidget from './DepDetailsWidget';
import { Course, CourseInstance, Opportunity, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';

export enum TabbedProfileEntryNames {
  profileCourses = 'PROFILE_COURSES',
  profileOpportunities = 'PROFILE_OPPORTUNITIES',
  profileDetails = 'PROFILE_DETAILS',
}

interface TabbedProfileEntriesProps {
  takenSlugs: string[];
  profileOpportunities: Opportunity[];
  studentID: string;
  profileCourses: Course[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
}

const active = (selectedTab) => {
  switch (selectedTab) {
    case TabbedProfileEntryNames.profileOpportunities:
      return 0;
    case TabbedProfileEntryNames.profileCourses:
      return 1;
    case TabbedProfileEntryNames.profileDetails:
      return 2;
    default:
      return 0;
  }
};

const TabbedProfileEntries: React.FC<TabbedProfileEntriesProps> = ({
  studentID,
  courseInstances,
  profileCourses,
  profileOpportunities,
  verificationRequests,
  opportunityInstances,
}) => {
  const [selectedTab, setSelectedTab] = useStickyState(DegreePlannerStateNames.selectedProfileTab, TabbedProfileEntryNames.profileOpportunities);

  const handleTabChange = (event, instance) => {
    const { activeIndex } = instance;
    event.preventDefault();
    switch (activeIndex) {
      case 0:
        setSelectedTab(TabbedProfileEntryNames.profileOpportunities);
        break;
      case 1:
        setSelectedTab(TabbedProfileEntryNames.profileCourses);
        break;
      case 2:
        setSelectedTab(TabbedProfileEntryNames.profileDetails);
        break;
      default:
        console.error(`Bad tab index: ${activeIndex}`);
    }
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="ProfileOpportunities">
          <Icon name="user" fitted color="grey" /> OPPS
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane key="ProfileOpportunitiesPane" active={active(selectedTab) === 0}>
          <ProfileOpportunities opportunities={profileOpportunities} studentID={studentID}
                                opportunityInstances={opportunityInstances} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="ProfileCourses">
          <Icon name="user" fitted color="grey" /> COURSE
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane key="ProfileCoursesPane" active={active(selectedTab) === 1}>
          <ProfileCourses studentID={studentID} courses={profileCourses} courseInstances={courseInstances} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: <Menu.Item key="ProfileDetails">DETAILS</Menu.Item>,
      pane: (
        <Tab.Pane key="ProfileDetailsPane" active={active(selectedTab) === 2}>
          <DepDetailsWidget verificationRequests={verificationRequests} />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded id="tabbedProfilesWidget">
      <Tab panes={panes} renderActiveOnly={false} onTabChange={(event, instance) => handleTabChange(event, instance)}
           activeIndex={active(selectedTab)} />
    </Segment>
  );
};

export default TabbedProfileEntries;
