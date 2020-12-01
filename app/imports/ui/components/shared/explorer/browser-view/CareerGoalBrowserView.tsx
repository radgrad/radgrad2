import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Header, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { ICareerGoal } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ProfileCard from './ProfileCard';

interface ICareerGoalBrowserViewProps {
  favoriteCareerGoals: ICareerGoal[];
  careerGoals: ICareerGoal[];
  // Saving Scroll Position
  careerGoalsScrollPosition: number;
  setCareerGoalsScrollPosition: (scrollPosition: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  careerGoalsScrollPosition: state.shared.scrollPosition.explorer.careerGoals,
});

const mapDispatchToProps = (dispatch) => ({
  setCareerGoalsScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCareerGoalsScrollPosition(scrollPosition)),
});

const CareerGoalBrowserView: React.FC<ICareerGoalBrowserViewProps> = ({ favoriteCareerGoals, careerGoals, careerGoalsScrollPosition, setCareerGoalsScrollPosition }) => {
  // TODO do we want to filter out the favorite career goals?
  const cardGroupElement: HTMLElement = document.getElementById('careerGoalsCardGroup');
  useEffect(() => {
    const savedScrollPosition = careerGoalsScrollPosition;
    if (savedScrollPosition && cardGroupElement) {
      cardGroupElement.scrollTo(0, savedScrollPosition);
    }
    return () => {
      if (cardGroupElement) {
        const currentScrollPosition = cardGroupElement.scrollTop;
        setCareerGoalsScrollPosition(currentScrollPosition);
      }
    };
  }, [cardGroupElement, careerGoalsScrollPosition, setCareerGoalsScrollPosition]);

  return (
    <div id="career-goal-browser-view">
      <Segment>
        <Header dividing>CAREER GOALS {careerGoals.length}</Header>
        <Card.Group itemsPerRow={2} stackable id="careerGoalsCardGroup">
          {careerGoals.map((goal) => <ProfileCard key={goal._id} item={goal} type={EXPLORER_TYPE.CAREERGOALS} />)}
        </Card.Group>
      </Segment>
    </div>
  );
};

const CareerGoalBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(CareerGoalBrowserView);

export default CareerGoalBrowserViewContainer;
