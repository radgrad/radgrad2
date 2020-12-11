import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { degreePlannerActions, degreePlannerTypes } from '../../../../redux/student/degree-planner';
import FavoriteOpportunitiesWidget from './FavoriteOpportunitiesWidget';
import FavoriteCoursesWidget from './FavoriteCoursesWidget';
import DepDetailsWidget from './DepDetailsWidget';
import FavoriteAcademicPlansWidget from './FavoriteAcademicPlansWidget';
import { RootState } from '../../../../redux/types';
import {
  IAcademicPlan,
  ICourse,
  ICourseInstance,
  IOpportunity,
  IOpportunityInstance,
  IVerificationRequest,
} from '../../../../typings/radgrad';

interface ITabbedFavoritesWidgetProps {
  takenSlugs: string[];
  academicPlans: IAcademicPlan[];
  selectedTab: string;
  selectFavoriteOpportunitiesTab: () => any;
  selectFavoritePlansTab: () => any;
  selectFavoriteCoursesTab: () => any;
  selectFavoriteDetailsTab: () => any;
  opportunities: IOpportunity[];
  studentID: string;
  courses: ICourse[];
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
  verificationRequests: IVerificationRequest[];
}

const mapStateToProps = (state: RootState) => ({
  selectedTab: state.student.degreePlanner.tab.selectedTab,
});

const mapDispatchToProps = (dispatch) => ({
  selectFavoriteOpportunitiesTab: () => dispatch(degreePlannerActions.selectFavoriteOpportunitiesTab()),
  selectFavoritePlansTab: () => dispatch(degreePlannerActions.selectFavoritePlansTab()),
  selectFavoriteCoursesTab: () => dispatch(degreePlannerActions.selectFavoriteCoursesTab()),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

const active = (selectedTab) => {
  switch (selectedTab) {
    case degreePlannerTypes.SELECT_FAVORITE_OPPORTUNITIES:
      return 0;
    case degreePlannerTypes.SELECT_FAVORITE_PLANS:
      return 1;
    case degreePlannerTypes.SELECT_FAVORITE_COURSES:
      return 2;
    case degreePlannerTypes.SELECT_FAVORITE_DETAILS:
      return 3;
    default:
      return 0;
  }
};

const TabbedFavoritesWidget: React.FC<ITabbedFavoritesWidgetProps> = (props) => {
  const handleTabChange = (event, instance) => {
    const { activeIndex } = instance;
    event.preventDefault();
    switch (activeIndex) {
      case 0:
        props.selectFavoriteOpportunitiesTab();
        break;
      case 1:
        props.selectFavoritePlansTab();
        break;
      case 2:
        props.selectFavoriteCoursesTab();
        break;
      case 3:
        props.selectFavoriteDetailsTab();
        break;
      default:
        console.error(`Bad tab index: ${activeIndex}`);
    }
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="FavoriteOpportunities">
          <Icon name="heart" fitted color="red" /> OPPS
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane
          key="FavoriteOpportunitiesPane"
          active={active(props.selectedTab) === 0}
        >
          <FavoriteOpportunitiesWidget opportunities={props.opportunities} studentID={props.studentID} opportunityInstances={props.opportunityInstances} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="FavoritePlans">
          <Icon name="heart" fitted color="red" /> PLAN
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane key="FavoritePlansPane" active={active(props.selectedTab) === 1}>
          <FavoriteAcademicPlansWidget plans={props.academicPlans} takenSlugs={props.takenSlugs} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="FavoriteCourses">
          <Icon name="heart" fitted color="red" /> COURSE
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane key="FavoriteCoursesPane" active={active(props.selectedTab) === 2}>
          <FavoriteCoursesWidget studentID={props.studentID} courses={props.courses} courseInstances={props.courseInstances} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="FavoriteDetails">DETAILS</Menu.Item>
      ),
      pane: (
        <Tab.Pane key="FavoriteDetailsPane" active={active(props.selectedTab) === 3}>
          <DepDetailsWidget verificationRequests={props.verificationRequests} />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded id="tabbedFavoritesWidget">
      <Tab
        panes={panes}
        renderActiveOnly={false}
        onTabChange={(event, instance) => handleTabChange(event, instance)}
        activeIndex={active(props.selectedTab)}
      />
    </Segment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TabbedFavoritesWidget);
