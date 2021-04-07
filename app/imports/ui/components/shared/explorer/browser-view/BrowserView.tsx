import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Card, Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { CHECKSTATE } from '../../../checklist/Checklist';
import { InterestsChecklist } from '../../../checklist/InterestsChecklist';
import ProfileCard from './ProfileCard';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import { CareerGoalsChecklist } from '../../../checklist/CareerGoalsChecklist';
import InterestSortWidget, { interestSortKeys } from './InterestSortWidget';

interface BrowserViewProps {
  interests: Interest[];
  items?: CareerGoal[] | Course[] | Opportunity[] | Interest[];
  profileInterestIDs: string[];
  inProfile: boolean;
  explorerType: string;
  // Saving Scroll Position
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => never;
  sortValue: string;
}

const mapStateToProps = (state: RootState, ownProps) => {
  switch (ownProps.explorerType) {
    case EXPLORER_TYPE.INTERESTS:
      return {
        scrollPosition: state.shared.scrollPosition.explorer.interests,
        sortValue: state.shared.cardExplorer.interests.sortValue,
      };
    case EXPLORER_TYPE.CAREERGOALS:
      return {
        scrollPosition: state.shared.scrollPosition.explorer.careerGoals,
        sortValue: state.shared.cardExplorer.careergoals.sortValue,
      };
  }
  return null;
};

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

const adminEmail = RadGradProperties.getAdminEmail();

const BrowserView: React.FC<BrowserViewProps> = ({
  interests,
  items,
  inProfile,
  scrollPosition,
  setScrollPosition,
  sortValue,
  explorerType,
}) => {
  const cardGroupElement: HTMLElement = document.getElementById('browserCardGroup');
  items = _.sortBy(items, (item) => item.name);
  switch (sortValue) {
    case interestSortKeys.mostRecent:
      items = _.sortBy(items, (item) => item.updatedAt);
      break;
    default:
      items = _.sortBy(items, (item) => item.name);
  }
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
  switch (explorerType) {
    case EXPLORER_TYPE.INTERESTS:
      checklist = new InterestsChecklist(currentUser);
      break;
    case EXPLORER_TYPE.CAREERGOALS:
      checklist = new CareerGoalsChecklist(currentUser);
      break;
  }
  return (
        <div id="explorer-browser-view">
            <Segment>
                <Header>
                    {inProfile
                      ? <p color='grey'><Icon name='heart' color='grey' size='large' />
                            {explorerType.toUpperCase()} IN MY PROFILE <WidgetHeaderNumber inputValue={items.length} />
                            {checklist.getState() === CHECKSTATE.IMPROVE ?
                                <span style={{ float: 'right' }}><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : ''}
                        </p>
                      : <p color='grey'>{explorerType.toUpperCase()} NOT IN MY PROFILE <WidgetHeaderNumber inputValue={items.length} />
                            <Button size="mini" color="teal" floated="right"
                                    href={`mailto:${adminEmail}?subject=New ${_.upperFirst(explorerType.slice(0, -1))} Suggestion`} basic>
                                <Icon name="mail" />
                                SUGGEST A NEW {explorerType.toUpperCase().slice(0, -1)}
                            </Button>
                        </p>
                    }
                </Header>
                <Divider />
                {!inProfile ? <InterestSortWidget /> : ''}
                <Card.Group itemsPerRow={4} stackable id="browserCardGroup">
                    {items.map((explorerItem) => (
                        <ProfileCard key={explorerItem._id} item={explorerItem} type={explorerType}
                                     cardLinkName={inProfile ? 'See Details / Remove from Profile' : 'See Details / Add to Profile'} />
                    ))}
                </Card.Group>
            </Segment>
        </div>
  );
};

const BrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(BrowserView);

export default BrowserViewContainer;
