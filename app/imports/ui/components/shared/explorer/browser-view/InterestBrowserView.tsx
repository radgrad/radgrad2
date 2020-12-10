import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Header, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { IInterest } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ProfileCard from './ProfileCard';

interface IInterestBrowserViewProps {
  favoriteInterests: IInterest[];
  favoriteCareerGoalsInterests: IInterest[];
  interests: IInterest[];
  // Saving Scroll Position
  interestsScrollPosition: number;
  setInterestsScrollPosition: (scrollPosition: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  interestsScrollPosition: state.shared.scrollPosition.explorer.interests,
});

const mapDispatchToProps = (dispatch) => ({
  setInterestsScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerInterestsScrollPosition(scrollPosition)),
});

const InterestBrowserView: React.FC<IInterestBrowserViewProps> = ({ favoriteInterests, favoriteCareerGoalsInterests, interests, interestsScrollPosition, setInterestsScrollPosition }) => {
  // TODO do we want to filter out the favoriteInterests and favoriteCareerGoalInterests from interests?
  const cardGroupElement: HTMLElement = document.getElementById('interestsCardGroup');
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

  return (
    <div id="interest-browser-view">
      <Segment>
        <Header dividing>INTERESTS {interests.length}</Header>
        <Card.Group itemsPerRow={2} stackable id="interestsCardGroup">
          {interests.map((interest) => <ProfileCard key={interest._id} item={interest} type={EXPLORER_TYPE.INTERESTS} />)}
        </Card.Group>
      </Segment>
    </div>
  );
};

const InterestBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(InterestBrowserView);

export default InterestBrowserViewContainer;