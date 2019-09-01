import * as React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import * as TYPES from '../../../redux/student/degree-planner/types';
import FavoriteOpportunitiesWidget from './FavoriteOpportunitiesWidget';
import FavoriteCoursesWidget from './FavoriteCoursesWidget';

interface ITabbedFavoritesWidgetProps {
  selectedTab: string;
  selectFavoriteOpportunitiesTab: () => any;
  selectFavoritePlansTab: () => any;
  selectFavoriteCoursesTab: () => any;
  selectFavoriteDetailsTab: () => any;
}

const mapStateToProps = (state) => ({
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
    case TYPES.SELECT_FAVORITE_OPPORTUNITIES:
      return 0;
    case TYPES.SELECT_FAVORITE_PLANS:
      return 1;
    case TYPES.SELECT_FAVORITE_COURSES:
      return 2;
    case TYPES.SELECT_FAVORITE_DETAILS:
      return 3;
    default:
      return 0;
  }
};

const handleTabChange = (props, event, instance) => {
  // console.log(props);
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
      console.error(`Bad tab index ${activeIndex}`);
  }
};

const TabbedFavoritesWidget = (props) => {
  const panes = [
    {
      menuItem: (
        <Menu.Item key='FavoriteOpportunities'><Icon name='heart' fitted={true} color={'red'}/> OPPS</Menu.Item>
      ),
      pane: (
        <Tab.Pane key='FavoriteOpportunitiesPane' active={active(props) === 0}><FavoriteOpportunitiesWidget/></Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key='FavoritePlans'><Icon name='heart' fitted={true} color={'red'}/> PLAN</Menu.Item>
      ),
      pane: (
        <Tab.Pane key='FavoritePlansPane' active={active(props) === 1}>Academic Plans</Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key='FavoriteCourses'><Icon name='heart' fitted={true} color={'red'}/> COUR</Menu.Item>
      ),
      pane: (
        <Tab.Pane key='FavoriteCoursesPane' active={active(props) === 2}><FavoriteCoursesWidget/></Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key='FavoriteDetails'>DETAILS</Menu.Item>
      ),
      pane: (
        <Tab.Pane key='FavoriteDetailsPane' active={active(props) === 3}>Details</Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded={true}>
      <Tab panes={panes} renderActiveOnly={false} onTabChange={(event, instance) => handleTabChange(props, event, instance)} activeIndex={active(props)}/>
    </Segment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TabbedFavoritesWidget);
