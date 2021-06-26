import React from 'react';
import _ from 'lodash';
import { Card, Grid } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { useStickyState } from '../../../../utilities/StickyState';
import ExplorerCard from './ExplorerCard';
import Sort from './Sort';
import * as Router from '../../utilities/router';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';
import RadGradHeader from '../../RadGradHeader';
import RadGradSegment from '../../RadGradSegment';
import Filter from './Filter';
import { EXPLORER_TYPE, EXPLORER_SORT_KEYS, EXPLORER_TYPE_ICON, EXPLORER_FILTER_KEYS } from '../../../../utilities/ExplorerUtils';
import { Users } from '../../../../../api/user/UserCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { ProfileOpportunities } from '../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import { ProfileCourses } from '../../../../../api/user/profile-entries/ProfileCourseCollection';
import { Courses } from '../../../../../api/course/CourseCollection';

interface BrowserViewProps {
  items: CareerGoal[] | Course[] | Opportunity[] | Interest[];
  explorerType: EXPLORER_TYPE;
}

const BrowserView: React.FC<BrowserViewProps> = ({ items, explorerType }) => {
  const [filterChoice] = useStickyState(`Filter.${explorerType}`, EXPLORER_FILTER_KEYS.NONE);
  const defaultSortChoice = (explorerType === EXPLORER_TYPE.COURSES) ? EXPLORER_SORT_KEYS.NUMBER
    : EXPLORER_SORT_KEYS.ALPHABETIC;
  const [sortChoice] = useStickyState(`Sort.${explorerType}`, defaultSortChoice);
  // const [scrollPosition, setScrollPosition] = useStickyState(`Scroll.${explorerType}`, 0);
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const profileEntries = ProfileInterests.findNonRetired({ userID });
  const interestIDs = profileEntries.map((f) => f.interestID);
  let explorerItems = _.sortBy(items, (item: any) => item.name);
  let profileItems;
  const getProfileItems = (type: EXPLORER_TYPE) => {
    switch (type) {
      case EXPLORER_TYPE.INTERESTS:
        profileItems = Users.getInterestIDs(userID).map((id) => Interests.findDoc(id));
        break;
      case EXPLORER_TYPE.CAREERGOALS:
        profileItems = ProfileCareerGoals.findNonRetired({ userID: userID }).map((f) => CareerGoals.findDoc(f.careerGoalID));
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        profileItems = ProfileOpportunities.findNonRetired({ userID: userID }).map((f) => Opportunities.findDoc(f.opportunityID)).filter(o => o.retired !== true);
        break;
      case EXPLORER_TYPE.COURSES:
        profileItems = ProfileCourses.findNonRetired({ userID: userID }).map((f) => Courses.findDoc(f.courseID));
        break;
    }
    explorerItems = profileItems;
    return explorerItems;
  };

  const getNonProfileItems = (type: EXPLORER_TYPE) => {
    profileItems = getProfileItems(type);
    switch (type) {
      case EXPLORER_TYPE.INTERESTS:
        explorerItems = Interests.findNonRetired().filter(md => profileItems.every(fd => fd._id !== md._id));
        break;
      case EXPLORER_TYPE.CAREERGOALS:
        explorerItems = CareerGoals.findNonRetired().filter(md => profileItems.every(fd => fd._id !== md._id));
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        explorerItems = Opportunities.findNonRetired().filter(md => profileItems.every(fd => fd._id !== md._id));
        break;
      case EXPLORER_TYPE.COURSES:
        explorerItems = Courses.findNonRetired().filter(md => profileItems.every(fd => fd._id !== md._id));
        break;
    }
    return explorerItems;
  };

  switch (filterChoice) {
    case EXPLORER_FILTER_KEYS.INPROFILE:
      explorerItems = getProfileItems(explorerType);
      break;
    case EXPLORER_FILTER_KEYS.NOTINPROFILE:
      explorerItems = getNonProfileItems(explorerType);
      break;
    case EXPLORER_FILTER_KEYS.THREEHUNDRED:
      explorerItems = explorerItems.filter((i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 300 && courseNumber < 400;
      });
      break;

    case EXPLORER_FILTER_KEYS.FOURHUNDRED:
      explorerItems = explorerItems.filter((i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 400 && courseNumber < 600;
      });
      break;
    case EXPLORER_FILTER_KEYS.SIXHUNDRED:
      explorerItems = explorerItems.filter((i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 600;
      });
      break;
    default:
    // if 'All', do no filtering
  }

  switch (sortChoice) {
    case EXPLORER_SORT_KEYS.MOST_RECENT: {
      explorerItems = _.sortBy(explorerItems, (item: any) => item.updatedAt);
      break;
    }
    case EXPLORER_SORT_KEYS.RECOMMENDED: {
      const preferred = new PreferredChoice(explorerItems, interestIDs);
      explorerItems = preferred.getOrderedChoices();
      break;
    }
    case EXPLORER_SORT_KEYS.INNOVATION: {
      explorerItems = _.sortBy(explorerItems, (item) => -item.ice.i);
      break;
    }
    case EXPLORER_SORT_KEYS.EXPERIENCE: {
      explorerItems = _.sortBy(explorerItems, (item) => -item.ice.e);
      break;
    }
    case EXPLORER_SORT_KEYS.NUMBER: {
      explorerItems = _.sortBy(explorerItems, (item) => item.num);
      break;
    }
    default: {
      explorerItems = _.sortBy(explorerItems, (item: any) => item.name);
    }
  }

  let icon;
  switch (explorerType) {
    case EXPLORER_TYPE.INTERESTS:
      icon = EXPLORER_TYPE_ICON.INTEREST;
      break;
    case EXPLORER_TYPE.CAREERGOALS:
      icon = EXPLORER_TYPE_ICON.CAREERGOAL;
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      icon = EXPLORER_TYPE_ICON.OPPORTUNITY;
      break;
  }

  const inProfile = (item: Interest | CareerGoal | Course | Opportunity, type: EXPLORER_TYPE) => {
    profileItems = getProfileItems(type);
    return !!profileItems.some(x => x._id === item._id);
  };

  const header = <RadGradHeader title={`${explorerType.replace('-', ' ')}`} count={explorerItems.length} icon={icon} />;
  return (
    <div id="explorer-browser-view">
      <RadGradSegment header={header}>
        <Grid>
          <Grid.Row style={{ paddingBottom: 0 }}>
            <Grid.Column style={{ paddingBottom: 0 }}>
              <Filter explorerType={explorerType} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: 0 }}>
            <Grid.Column style={{ paddingTop: 0 }}>
              <Sort explorerType={explorerType} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Card.Group itemsPerRow={4} stackable id="browserCardGroup" style={{ margin: '0px' }}>
          {explorerItems.map((explorerItem) => (
            <ExplorerCard key={explorerItem._id} item={explorerItem} type={explorerType} inProfile={inProfile(explorerItem, explorerType)} />
          ))}
        </Card.Group>
      </RadGradSegment>
    </div>
  );
};

export default BrowserView;
