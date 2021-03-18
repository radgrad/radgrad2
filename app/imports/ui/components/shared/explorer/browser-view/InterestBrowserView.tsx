import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Card, Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { Interest } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { CHECKSTATE } from '../../../checklist/Checklist';
import { InterestsChecklist } from '../../../checklist/InterestsChecklist';
import ProfileCard from './ProfileCard';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import InterestSortWidget, { interestSortKeys } from './InterestSortWidget';

interface InterestBrowserViewProps {
  interests: Interest[];
  inProfile: boolean;
  // Saving Scroll Position
  interestsScrollPosition: number;
  setInterestsScrollPosition: (scrollPosition: number) => any;
  sortValue: string;
}

const mapStateToProps = (state: RootState) => ({
  interestsScrollPosition: state.shared.scrollPosition.explorer.interests,
  sortValue: state.shared.cardExplorer.interests.sortValue,
});

const mapDispatchToProps = (dispatch) => ({
  setInterestsScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerInterestsScrollPosition(scrollPosition)),
});

const adminEmail = RadGradProperties.getAdminEmail();

const InterestBrowserView: React.FC<InterestBrowserViewProps> = ({
  interests,
  inProfile,
  interestsScrollPosition,
  setInterestsScrollPosition,
  sortValue,
}) => {
  const cardGroupElement: HTMLElement = document.getElementById('interestsCardGroup');
  // eslint-disable-next-line no-param-reassign
  interests = _.sortBy(interests, (item) => item.name);
  switch (sortValue) {
    case interestSortKeys.mostRecent:
      // eslint-disable-next-line no-param-reassign
      interests = _.sortBy(interests, (item) => item.updatedAt);
      break;
    default:
      // eslint-disable-next-line no-param-reassign
      interests = _.sortBy(interests, (item) => item.name);
  }
  useEffect(() => {
    const savedScrollPosition = interestsScrollPosition;
    if (savedScrollPosition && cardGroupElement) {
      cardGroupElement.scrollTo(0, savedScrollPosition);
    }
    return () => {
      if (cardGroupElement) {
        const currentScrollPosition = cardGroupElement.scrollTop;
        setInterestsScrollPosition(currentScrollPosition);
      }
    };
  }, [cardGroupElement, interestsScrollPosition, setInterestsScrollPosition]);
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const checklist = new InterestsChecklist(currentUser);
  return (
    <div id="interest-browser-view">
      <Segment>
        <Header>
          {inProfile
            ? <p color='grey'><Icon name='heart' color='grey' size='large' />
              INTERESTS IN MY PROFILE <WidgetHeaderNumber inputValue={interests.length} />
              {checklist.getState() === CHECKSTATE.IMPROVE ?
                <span style={{ float: 'right' }}><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : ''}
            </p>
            : <p color='grey'>INTERESTS NOT IN MY PROFILE <WidgetHeaderNumber inputValue={interests.length} />
              <Button size="mini" color="teal" floated="right"
                      href={`mailto:${adminEmail}?subject=New Interest Suggestion`} basic>
                <Icon name="mail" />
                SUGGEST A NEW INTEREST
              </Button>
            </p>
          }
        </Header>
        <Divider />
        {!inProfile ? <InterestSortWidget /> : ''}
        <Card.Group itemsPerRow={4} stackable id="interestsCardGroup">
          {interests.map((interest) => (
            <ProfileCard key={interest._id} item={interest} type={EXPLORER_TYPE.INTERESTS}
                         cardLinkName={inProfile ? 'See Details / Remove from Profile' : 'See Details / Add to Profile'} />
          ))}
        </Card.Group>
      </Segment>
    </div>
  );
};

const InterestBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(InterestBrowserView);

export default InterestBrowserViewContainer;
