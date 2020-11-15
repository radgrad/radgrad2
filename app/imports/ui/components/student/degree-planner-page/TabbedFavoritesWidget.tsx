import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { degreePlannerActions, degreePlannerTypes } from '../../../../redux/student/degree-planner';
import FavoriteOpportunitiesWidget from './FavoriteOpportunitiesWidget';
import FavoriteCoursesWidget from './FavoriteCoursesWidget';
import DepDetailsWidget from './DepDetailsWidget';
import FavoriteAcademicPlansWidget from './FavoriteAcademicPlansWidget';
import { tabbedFavoritesWidget } from '../student-widget-names';
import { RootState } from '../../../../redux/types';

interface ITabbedFavoritesWidgetProps {
  // eslint-disable-next-line react/no-unused-prop-types
  selectedTab: string;
  // eslint-disable-next-line react/no-unused-prop-types
  selectFavoriteOpportunitiesTab: () => any;
  // eslint-disable-next-line react/no-unused-prop-types
  selectFavoritePlansTab: () => any;
  // eslint-disable-next-line react/no-unused-prop-types
  selectFavoriteCoursesTab: () => any;
  // eslint-disable-next-line react/no-unused-prop-types
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

const active = (props) => {
  switch (props.selectedTab) {
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

const handleTabChange = (props, event, instance) => {
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

const TabbedFavoritesWidget = (props: ITabbedFavoritesWidgetProps) => {
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
          active={active(props) === 0}
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
        <Tab.Pane key="FavoritePlansPane" active={active(props) === 1}>
          <FavoriteAcademicPlansWidget />
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
        <Tab.Pane key="FavoriteCoursesPane" active={active(props) === 2}>
          <FavoriteCoursesWidget />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="FavoriteDetails">DETAILS</Menu.Item>
      ),
      pane: (
        <Tab.Pane key="FavoriteDetailsPane" active={active(props) === 3}>
          <DepDetailsWidget />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded id={tabbedFavoritesWidget}>
      <Tab
        panes={panes}
        renderActiveOnly={false}
        onTabChange={(event, instance) => handleTabChange(props, event, instance)}
        activeIndex={active(props)}
      />
    </Segment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TabbedFavoritesWidget);
