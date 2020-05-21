import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { pageTrackingActions } from '../../../redux/shared/page-tracking';
import { RootState } from '../../../redux/types';

interface IPageTrackingScoreboardMenuProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  scoreboardMenuCategory: IPageInterestsCategoryTypes;
  // comparisonMenuCategory: IPageInterestsCategoryTypes;
  setPageTrackingScoreboardMenuCategory: (category: IPageInterestsCategoryTypes) => any;
  // setPageTrackingComparisonMenuCategory: (category: IPageInterestsCategoryTypes) => any;
}

const mapStateToProps = (state: RootState) => ({
  scoreboardMenuCategory: state.shared.pageTracking.scoreboardMenuCategory,
  // comparisonMenuCategory: state.shared.pageTracking.comparisonMenuCategory,
});

const mapDispatchToProps = (dispatch: any): { [key: string]: any } => ({
  setPageTrackingScoreboardMenuCategory: (category: IPageInterestsCategoryTypes) => dispatch(pageTrackingActions.setPageTrackingScoreboardMenuCategory(category)),
  // setPageTrackingComparisonMenuCategory: (category: IPageInterestsCategoryTypes) => dispatch(pageTrackingActions.setPageTrackingComparisonMenuCategory(category)),
});

const menuItems = [
  { key: PageInterestsCategoryTypes.CAREERGOAL, text: 'Career Goals' },
  { key: PageInterestsCategoryTypes.COURSE, text: 'Courses' },
  { key: PageInterestsCategoryTypes.INTEREST, text: 'Interests' },
  { key: PageInterestsCategoryTypes.OPPORTUNITY, text: 'Opportunities' },
];

const PageTrackingScoreboardMenu = (props: IPageTrackingScoreboardMenuProps) => {
  const handleClick = (e, { content }) => {
    e.preventDefault();
    switch (content) {
      case 'Career Goals':
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.CAREERGOAL);
        break;
      case 'Courses':
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.COURSE);
        break;
      case 'Interests':
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.INTEREST);
        break;
      case 'Opportunities':
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.OPPORTUNITY);
        break;
      default:
        console.error(`Content does not match valid Page Interest Category Types: ${content}`);
        break;
    }
  };

  return (
    <Menu vertical>
      {menuItems.map((item, index) => (
        <Menu.Item
          key={item.key}
          content={item.text}
          active={item.key === props.scoreboardMenuCategory ? true : undefined}
          onClick={handleClick}
        />
      ))}
    </Menu>
  );
};

const PageTrackingScoreboardMenuCon = connect(mapStateToProps, mapDispatchToProps)(PageTrackingScoreboardMenu);
const PageTrackingScoreboardMenuContainer = withRouter(PageTrackingScoreboardMenuCon);
export default PageTrackingScoreboardMenuContainer;
