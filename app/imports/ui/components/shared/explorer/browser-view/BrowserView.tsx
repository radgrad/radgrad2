import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Card, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { CHECKSTATE } from '../../../checklist/Checklist';
import { InterestsChecklist } from '../../../checklist/InterestsChecklist';
import ProfileCard from './ProfileCard';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import { CareerGoalsChecklist } from '../../../checklist/CareerGoalsChecklist';
import Sort from './Sort';
import * as Router from '../../utilities/router';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';
import RadGradHeader from '../../RadGradHeader';
import RadGradSegment from '../../RadGradSegment';
import { EXPLORERTYPEICON } from '../../../../utilities/ExplorerTypeIcon';
import { EXPLORERTYPE } from '../../../../utilities/ExplorerType';
import { EXPLORERSORTKEY } from '../../../../utilities/ExplorerSortKey';

interface BrowserViewProps {
  items: CareerGoal[] | Course[] | Opportunity[] | Interest[];
  profileInterestIDs: string[];
  inProfile: boolean;
  explorerType: EXPLORERTYPE;
  // Saving Scroll Position
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => never;
  sortValue: string;
}

const mapStateToProps = (state: RootState, ownProps) => ({
  scrollPosition: state.shared.scrollPosition.explorer[ownProps.explorerType.replaceAll('-', '').toLowerCase()],
  sortValue: state.shared.cardExplorer[ownProps.explorerType.replaceAll('-', '').toLowerCase()].sortValue,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  switch (ownProps.explorerType) {
    case EXPLORERTYPE.INTERESTS:
      return {
        setScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerInterestsScrollPosition(scrollPosition)),
      };
    case EXPLORERTYPE.CAREERGOALS:
      return {
        setScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCareerGoalsScrollPosition(scrollPosition)),
      };
  }
  return null;
};

const adminEmail = RadGradProperties.getAdminEmail();

const BrowserView: React.FC<BrowserViewProps> = ({
  items,
  inProfile,
  scrollPosition,
  setScrollPosition,
  sortValue,
  explorerType,
}) => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const profileEntries = ProfileInterests.findNonRetired({ userID });
  const interestIDs = profileEntries.map((f) => f.interestID);
  const preferred = new PreferredChoice(items, interestIDs);
  // @ts-ignore
  let explorerItems = _.sortBy(items, (item) => item.name);
  switch (sortValue) {
    case EXPLORERSORTKEY.MOST_RECENT: {
      // @ts-ignore
      explorerItems = _.sortBy(items, (item) => item.updatedAt);
      break;
    }
    case EXPLORERSORTKEY.RECOMMENDED:
      explorerItems = preferred.getOrderedChoices();
      break;
    default:
      // @ts-ignore
      explorerItems = _.sortBy(items, (item) => item.name);
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
  const currentUser = Meteor.user() ? Meteor.user().username : '';

  let checklist;
  let icon;
  switch (explorerType) {
    case EXPLORERTYPE.INTERESTS:
      checklist = new InterestsChecklist(currentUser);
      icon = EXPLORERTYPEICON.INTEREST;
      break;
    case EXPLORERTYPE.CAREERGOALS:
      checklist = new CareerGoalsChecklist(currentUser);
      icon = EXPLORERTYPEICON.CAREERGOAL;
      break;
  }

  const rightsideInProfile =  checklist.getState() === CHECKSTATE.IMPROVE ?
    <span><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : '' ;
  const rightsideNotInProfile =
    <Button size="mini" color="teal" floated="right"
            href={`mailto:${adminEmail}?subject=New ${_.upperFirst(explorerType.slice(0, -1))} Suggestion`} basic>
      <Icon name="mail" />
      SUGGEST A NEW {explorerType.toUpperCase().replace('-', ' ').slice(0, -1)}
    </Button>;
  const header = inProfile ?
    <RadGradHeader title= {`${explorerType.replace('-', ' ')} IN MY PROFILE`} count = {explorerItems.length} icon={icon} rightside={rightsideInProfile}/>
    :
    <RadGradHeader title={`${explorerType.replace('-', ' ')} NOT IN MY PROFILE`} count = {explorerItems.length} rightside={rightsideNotInProfile}/> ;
  return (
    <div id="explorer-browser-view">
    <RadGradSegment header={header}>
      {!inProfile ? <Sort explorerType={explorerType} /> : ''}
      <Card.Group itemsPerRow={4} stackable id="browserCardGroup">
        {explorerItems.map((explorerItem) => (
          <ProfileCard key={explorerItem._id} item={explorerItem} type={explorerType} inProfile={inProfile} />
        ))}
      </Card.Group>
    </RadGradSegment>
    </div>
  );
};

const BrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(BrowserView);

export default BrowserViewContainer;
