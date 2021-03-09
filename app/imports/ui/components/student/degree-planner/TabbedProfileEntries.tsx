import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { degreePlannerActions, degreePlannerTypes } from '../../../../redux/student/degree-planner';
import ProfileOpportunities from './ProfileOpportunities';
import ProfileCourses from './ProfileCourses';
import DepDetailsWidget from './DepDetailsWidget';
import { RootState } from '../../../../redux/types';
import { Course, CourseInstance, Opportunity, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';

interface TabbedProfileEntriesProps {
  takenSlugs: string[];
  selectedTab: string;
  selectProfileOpportunitiesTab: () => { type: string; selectedTab: string };
  selectProfilePlansTab: () => { type: string; selectedTab: string };
  selectProfileCoursesTab: () => { type: string; selectedTab: string };
  selectProfileDetailsTab: () => { type: string; selectedTab: string };
  opportunities: Opportunity[];
  studentID: string;
  courses: Course[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
}

const mapStateToProps = (state: RootState) => ({
  selectedTab: state.student.degreePlanner.tab.selectedTab,
});

const mapDispatchToProps = (dispatch) => ({
  selectProfileOpportunitiesTab: () => dispatch(degreePlannerActions.selectProfileOpportunitiesTab()),
  selectProfileCoursesTab: () => dispatch(degreePlannerActions.selectProfileCoursesTab()),
  selectProfileDetailsTab: () => dispatch(degreePlannerActions.selectProfileDetailsTab()),
});

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
  selectProfilePlansTab,
  selectProfileOpportunitiesTab,
  studentID,
  takenSlugs,
  courseInstances,
  courses,
  selectProfileDetailsTab,
  selectProfileCoursesTab,
  selectedTab,
  opportunities,
  verificationRequests,
  opportunityInstances,
}) => {
  const handleTabChange = (event, instance) => {
    const { activeIndex } = instance;
    event.preventDefault();
    switch (activeIndex) {
      case 0:
        selectProfileOpportunitiesTab();
        break;
      case 1:
        selectProfileCoursesTab();
        break;
      case 2:
        selectProfileDetailsTab();
        break;
      default:
        console.error(`Bad tab index: ${activeIndex}`);
    }
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="ProfileOpportunities">
          <Icon name="heart" fitted color="red" /> OPPS
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
          <Icon name="heart" fitted color="red" /> COURSE
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

export default connect(mapStateToProps, mapDispatchToProps)(TabbedProfileEntries);
