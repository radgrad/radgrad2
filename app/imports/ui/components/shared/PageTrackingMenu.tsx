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
  type: 'scoreboard' | 'comparison';
  scoreboardMenuCategory: IPageInterestsCategoryTypes;
  comparisonMenuCategory: IPageInterestsCategoryTypes;
  setPageTrackingScoreboardMenuCategory: (category: IPageInterestsCategoryTypes) => any;
  setPageTrackingComparisonMenuCategory: (category: IPageInterestsCategoryTypes) => any;
}

const mapStateToProps = (state: RootState) => ({
  scoreboardMenuCategory: state.shared.pageTracking.scoreboardMenuCategory,
  comparisonMenuCategory: state.shared.pageTracking.comparisonMenuCategory,
});

const mapDispatchToProps = (dispatch: any): { [key: string]: any } => ({
  setPageTrackingScoreboardMenuCategory: (category: IPageInterestsCategoryTypes) => dispatch(pageTrackingActions.setPageTrackingScoreboardMenuCategory(category)),
  setPageTrackingComparisonMenuCategory: (category: IPageInterestsCategoryTypes) => dispatch(pageTrackingActions.setPageTrackingComparisonMenuCategory(category)),
});

enum PageTrackingMenuType {
  CAREERGOAL = 'Career Goals',
  COURSE = 'Courses',
  INTEREST = 'Interests',
  OPPORTUNITY = 'Opportunities',
}

type IPageTrackingMenuTypes =
  PageTrackingMenuType.CAREERGOAL
  | PageTrackingMenuType.COURSE
  | PageTrackingMenuType.INTEREST
  | PageTrackingMenuType.OPPORTUNITY;

const menuItems = [
  { key: PageInterestsCategoryTypes.CAREERGOAL, text: PageTrackingMenuType.CAREERGOAL },
  { key: PageInterestsCategoryTypes.COURSE, text: PageTrackingMenuType.COURSE },
  { key: PageInterestsCategoryTypes.INTEREST, text: PageTrackingMenuType.INTEREST },
  { key: PageInterestsCategoryTypes.OPPORTUNITY, text: PageTrackingMenuType.OPPORTUNITY },
];

const PageTrackingMenu = (props: IPageTrackingScoreboardMenuProps) => {
  const setPageTrackingScoreboardMenuCategory = (content: IPageTrackingMenuTypes) => {
    switch (content) {
      case PageTrackingMenuType.CAREERGOAL:
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.CAREERGOAL);
        break;
      case PageTrackingMenuType.COURSE:
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.COURSE);
        break;
      case PageTrackingMenuType.INTEREST:
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.INTEREST);
        break;
      case PageTrackingMenuType.OPPORTUNITY:
        props.setPageTrackingScoreboardMenuCategory(PageInterestsCategoryTypes.OPPORTUNITY);
        break;
      default:
        console.error(`Content does not match valid Page Interest Category Types: ${content}`);
        break;
    }
  };

  const setPageTrackingComparisonMenuCategory = (content: IPageTrackingMenuTypes) => {
    switch (content) {
      case PageTrackingMenuType.CAREERGOAL:
        props.setPageTrackingComparisonMenuCategory(PageInterestsCategoryTypes.CAREERGOAL);
        break;
      case PageTrackingMenuType.COURSE:
        props.setPageTrackingComparisonMenuCategory(PageInterestsCategoryTypes.COURSE);
        break;
      case PageTrackingMenuType.INTEREST:
        props.setPageTrackingComparisonMenuCategory(PageInterestsCategoryTypes.INTEREST);
        break;
      case PageTrackingMenuType.OPPORTUNITY:
        props.setPageTrackingComparisonMenuCategory(PageInterestsCategoryTypes.OPPORTUNITY);
        break;
      default:
        console.error(`Content does not match valid Page Interest Category Types: ${content}`);
        break;
    }
  };

  const handleClick = (e, { content }) => {
    e.preventDefault();
    if (props.type === 'scoreboard') {
      setPageTrackingScoreboardMenuCategory(content);
    }
    setPageTrackingComparisonMenuCategory(content);
  };

  return (
    <Menu vertical>
      {menuItems.map((item) => (
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

const PageTrackingScoreboardMenuCon = connect(mapStateToProps, mapDispatchToProps)(PageTrackingMenu);
const PageTrackingScoreboardMenuContainer = withRouter(PageTrackingScoreboardMenuCon);
export default PageTrackingScoreboardMenuContainer;
