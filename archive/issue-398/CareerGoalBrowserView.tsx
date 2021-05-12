import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../redux/shared/scrollPosition';
import { RootState } from '../redux/types';
import { CareerGoal } from '../../app/imports/typings/radgrad';
import { EXPLORER_TYPE } from '../../app/imports/ui/layouts/utilities/route-constants';
import ExplorerCard from '../../app/imports/ui/components/shared/explorer/browser-view/ExplorerCard';
import PreferredChoice from '../../app/imports/api/degree-plan/PreferredChoice';
import WidgetHeaderNumber from '../../app/imports/ui/components/shared/explorer/WidgetHeaderNumber';
import { CHECKSTATE } from '../../app/imports/ui/components/checklist/Checklist';
import { CareerGoalsChecklist } from '../../app/imports/ui/components/checklist/CareerGoalsChecklist';
import { RadGradProperties } from '../../app/imports/api/radgrad/RadGradProperties';

interface CareerGoalBrowserViewProps {
  profileInterestIDs: string[];
  careerGoals: CareerGoal[];
  inProfile: boolean;
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

const CareerGoalBrowserView: React.FC<CareerGoalBrowserViewProps> = ({
  profileInterestIDs,
  careerGoals,
  careerGoalsScrollPosition,
  setCareerGoalsScrollPosition,
  inProfile }) => {
  const cardGroupElement: HTMLElement = document.getElementById('careerGoalsCardGroup');
  const preferred = new PreferredChoice(careerGoals, profileInterestIDs);
  const ordered = preferred.getOrderedChoices();
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const checklist = new CareerGoalsChecklist(currentUser);
  const adminEmail = RadGradProperties.getAdminEmail();
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
        <Header>
          {inProfile
            ? <p color='grey'><Icon name='briefcase' color='grey' size='large' />
              CAREER GOALS IN MY PROFILE <WidgetHeaderNumber inputValue={careerGoals.length} />
              {checklist.getState() === CHECKSTATE.IMPROVE ?
                <span style={{ float: 'right' }}><Icon name='exclamation triangle' color='red' /> {checklist.getTitleText()}</span> : ''}
            </p>
            : <p color='grey'>CAREER GOALS NOT IN MY PROFILE <WidgetHeaderNumber inputValue={careerGoals.length} />
              <Button size="mini" color="teal" floated="right"
                      href={`mailto:${adminEmail}?subject=New Career Suggestion`} basic>
                <Icon name="mail" />
                SUGGEST A NEW CAREER
              </Button>
            </p>
          }
        </Header>
        <Divider />
          {/* {!inProfile ? <InterestSortWidget /> : ''} */}
        <Card.Group itemsPerRow={4} stackable id="careerGoalsCardGroup">
          {ordered.map((goal) => (
            <ExplorerCard key={goal._id} item={goal} type={EXPLORER_TYPE.CAREERGOALS}
                          cardLinkName={inProfile ? 'See Details / Remove from Profile' : 'See Details / Add to Profile'} />
          ))}
        </Card.Group>
      </Segment>
    </div>
  );
};

const CareerGoalBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(CareerGoalBrowserView);

export default CareerGoalBrowserViewContainer;
