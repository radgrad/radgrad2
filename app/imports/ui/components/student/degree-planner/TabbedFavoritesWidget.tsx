import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { degreePlannerActions, degreePlannerTypes } from '../../../../redux/student/degree-planner';
import FavoriteOpportunitiesWidget from './FavoriteOpportunitiesWidget';
import FavoriteCoursesWidget from './FavoriteCoursesWidget';
import DepDetailsWidget from './DepDetailsWidget';
import FavoriteAcademicPlansWidget from './FavoriteAcademicPlansWidget';
import { RootState } from '../../../../redux/types';
import { IAcademicPlan } from '../../../../typings/radgrad';

interface ITabbedFavoritesWidgetProps {
  takenSlugs: string[];
  academicPlans: IAcademicPlan[];
  selectedTab: string;
  selectFavoriteOpportunitiesTab: () => any;
  selectFavoritePlansTab: () => any;
  selectFavoriteCoursesTab: () => any;
  selectFavoriteDetailsTab: () => any;
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

const TabbedFavoritesWidget: React.FC<ITabbedFavoritesWidgetProps> = ({ takenSlugs, academicPlans, selectedTab, selectFavoriteCoursesTab, selectFavoriteDetailsTab, selectFavoriteOpportunitiesTab, selectFavoritePlansTab }) => {
  console.log(academicPlans, takenSlugs);
  const handleTabChange = (event, instance) => {
    const { activeIndex } = instance;
    event.preventDefault();
    switch (activeIndex) {
      case 0:
        selectFavoriteOpportunitiesTab();
        break;
      case 1:
        selectFavoritePlansTab();
        break;
      case 2:
        selectFavoriteCoursesTab();
        break;
      case 3:
        selectFavoriteDetailsTab();
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
          active={active(selectedTab) === 0}
        >
          <FavoriteOpportunitiesWidget />
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
        <Tab.Pane key="FavoritePlansPane" active={active(selectedTab) === 1}>
          <FavoriteAcademicPlansWidget plans={academicPlans} takenSlugs={takenSlugs} />
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
        <Tab.Pane key="FavoriteCoursesPane" active={active(selectedTab) === 2}>
          <FavoriteCoursesWidget />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="FavoriteDetails">DETAILS</Menu.Item>
      ),
      pane: (
        <Tab.Pane key="FavoriteDetailsPane" active={active(selectedTab) === 3}>
          <DepDetailsWidget />
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
        activeIndex={active(selectedTab)}
      />
    </Segment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TabbedFavoritesWidget);
