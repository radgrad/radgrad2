import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
// import { CHECKSTATE } from '../../../checklist/Checklist';
// import { InterestsChecklist } from '../../../checklist/InterestsChecklist';
import ProfileCard from './ProfileCard';
// import { CareerGoalsChecklist } from '../../../checklist/CareerGoalsChecklist';
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

interface BrowserViewProps {
  items: CareerGoal[] | Course[] | Opportunity[] | Interest[];
  profileInterestIDs: string[];
  inProfile: boolean;
  explorerType: EXPLORER_TYPE;
  // Saving Scroll Position
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => never;
  sortValue: string;
  filterChoice: string;
}

const mapStateToProps = (state: RootState, ownProps) => ({
  scrollPosition: state.shared.scrollPosition.explorer[ownProps.explorerType.replaceAll('-', '').toLowerCase()],
  sortValue: state.shared.cardExplorer[ownProps.explorerType.replaceAll('-', '').toLowerCase()].sortValue,
  filterChoice: state.shared.cardExplorer[ownProps.explorerType.replaceAll('-', '').toLowerCase()].filterValue,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  switch (ownProps.explorerType) {
    case EXPLORER_TYPE.INTERESTS:
      return {
        setScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerInterestsScrollPosition(scrollPosition)),
      };
    case EXPLORER_TYPE.CAREERGOALS:
      return {
        setScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCareerGoalsScrollPosition(scrollPosition)),
      };
  }
  return null;
};

const BrowserView: React.FC<BrowserViewProps> = ({
  items,
  scrollPosition,
  setScrollPosition,
  sortValue,
  explorerType,
  filterChoice,
}) => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const profileEntries = ProfileInterests.findNonRetired({ userID });
  const interestIDs = profileEntries.map((f) => f.interestID);
  const preferred = new PreferredChoice(items, interestIDs);
  let explorerItems = _.sortBy(items, (item: any) => item.name);
  switch (sortValue) {
    case EXPLORER_SORT_KEYS.MOST_RECENT: {
      explorerItems = _.sortBy(items, (item: any) => item.updatedAt);
      break;
    }
    case EXPLORER_SORT_KEYS.RECOMMENDED:
      explorerItems = preferred.getOrderedChoices();
      break;
    default: {
      explorerItems = _.sortBy(items, (item:any) => item.name);
    }
  }

  let profileItems;
  const getProfileItems = (type:EXPLORER_TYPE) => {
    switch (type){
      case EXPLORER_TYPE.INTERESTS:
        profileItems = Users.getInterestIDs(userID).map((id) => Interests.findDoc(id));
        break;
      case EXPLORER_TYPE.CAREERGOALS:
        profileItems = ProfileCareerGoals.findNonRetired({ userID: userID }).map((f) => CareerGoals.findDoc(f.careerGoalID));
        break;
    }
    explorerItems = profileItems;
    return explorerItems;
  };

  const getNonProfileItems = (type:EXPLORER_TYPE) => {
    profileItems = getProfileItems(type);
    switch (type){
      case EXPLORER_TYPE.INTERESTS:
        explorerItems = Interests.findNonRetired().filter(md => profileItems.every(fd => fd._id !== md._id));
        break;
      case EXPLORER_TYPE.CAREERGOALS:
        explorerItems = CareerGoals.findNonRetired().filter( md => profileItems.every(fd => fd._id !== md._id));
        break;
    }
    return explorerItems;
  };

  switch (filterChoice){
    case EXPLORER_FILTER_KEYS.INPROFILE: {
      getProfileItems(explorerType);
      break;
    }
    case EXPLORER_FILTER_KEYS.NOTINPROFILE:
      getNonProfileItems(explorerType);
      break;
    default:
      // do no filtering
  }

  const cardGroupElement: HTMLElement = document.getElementById('browserCardGroup');
  useEffect(() => {
    const savedScrollPosition = scrollPosition;
    if (savedScrollPosition && cardGroupElement) {
      cardGroupElement.scrollTo(0, savedScrollPosition);
    }
    return () => {
      if (cardGroupElement) {
        const currentScrollPosition = cardGroupElement.scrollTop;
        setScrollPosition(currentScrollPosition);
      }
    };
  }, [cardGroupElement, scrollPosition, setScrollPosition]);
  // const currentUser = Meteor.user() ? Meteor.user().username : '';

  // let checklist;
  let icon;
  switch (explorerType) {
    case EXPLORER_TYPE.INTERESTS:
      // checklist = new InterestsChecklist(currentUser);
      icon = EXPLORER_TYPE_ICON.INTEREST;
      break;
    case EXPLORER_TYPE.CAREERGOALS:
      // checklist = new CareerGoalsChecklist(currentUser);
      icon = EXPLORER_TYPE_ICON.CAREERGOAL;
      break;
  }

  const inProfile = (item:Interest | CareerGoal | Course | Opportunity, type:EXPLORER_TYPE) => {
    profileItems = getProfileItems(type);
    return !! profileItems.some(x => x._id == item._id);
  };
  // const rightsideInProfile =  checklist.getState() === CHECKSTATE.IMPROVE ?
  //   <span><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : '' ;
  const rightside = <Filter explorerType={explorerType} />;
  const header = <RadGradHeader title= {`${explorerType.replace('-', ' ')}`} count = {explorerItems.length}
                                icon={icon} rightside={rightside}/>;
  return (
    <div id="explorer-browser-view">
    <RadGradSegment header={header}>
     <Sort explorerType={explorerType} />
      <Card.Group itemsPerRow={4} stackable id="browserCardGroup">
        {explorerItems.map((explorerItem) => (
          <ProfileCard key={explorerItem._id} item={explorerItem} type={explorerType} inProfile = {inProfile(explorerItem, explorerType)} />
        ))}
      </Card.Group>
    </RadGradSegment>
    </div>
  );
};

const BrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(BrowserView);

export default BrowserViewContainer;
