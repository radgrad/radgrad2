import React from 'react';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { degreePlannerTypes } from '../../../../redux/student/degree-planner';
import { useStickyState } from '../../../utilities/StickyState';
import ProfileOpportunities from './ProfileOpportunities';
import ProfileCourses from './ProfileCourses';
import DepDetailsWidget from './DepDetailsWidget';
import { Course, CourseInstance, Opportunity, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';

interface TabbedProfileEntriesProps {
  takenSlugs: string[];
  opportunities: Opportunity[];
  studentID: string;
  courses: Course[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
}

const active = (selectedTab) => {
  switch (selectedTab) {
    case degreePlannerTypes.SELECT_PROFILE_OPPORTUNITIES:
      return 0;
    case degreePlannerTypes.SELECT_PROFILE_COURSES:
      return 1;
    case degreePlannerTypes.SELECT_PROFILE_DETAILS:
      return 2;
    default:
      return 0;
  }
};

const TabbedProfileEntries: React.FC<TabbedProfileEntriesProps> = ({
  studentID,
  courseInstances,
  courses,
  opportunities,
  verificationRequests,
  opportunityInstances,
}) => {
  const [selectedTab, setSelectedTab] = useStickyState('Planner.selectedTab', degreePlannerTypes.SELECT_PROFILE_OPPORTUNITIES);
  const handleTabChange = (event, instance) => {
    const { activeIndex } = instance;
    event.preventDefault();
    switch (activeIndex) {
      case 0:
        setSelectedTab(degreePlannerTypes.SELECT_PROFILE_OPPORTUNITIES);
        break;
      case 1:
        setSelectedTab(degreePlannerTypes.SELECT_PROFILE_COURSES);
        break;
      case 2:
        setSelectedTab(degreePlannerTypes.SELECT_PROFILE_DETAILS);
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
          <ProfileOpportunities opportunities={opportunities} studentID={studentID} opportunityInstances={opportunityInstances} />
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
          <ProfileCourses studentID={studentID} courses={courses} courseInstances={courseInstances} />
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
      <Tab panes={panes} renderActiveOnly={false} onTabChange={(event, instance) => handleTabChange(event, instance)} activeIndex={active(selectedTab)} />
    </Segment>
  );
};

export default TabbedProfileEntries;
