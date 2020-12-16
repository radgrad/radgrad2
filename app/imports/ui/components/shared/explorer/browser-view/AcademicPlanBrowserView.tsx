import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Header, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { AcademicPlan, FavoriteAcademicPlan } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import AcademicPlanCard from './AcademicPlanCard';

interface AcademicPlanBrowserViewProps {
  favoritePlans: FavoriteAcademicPlan[];
  academicPlans: AcademicPlan[];
  // Saving Scroll Position
  plansScrollPosition: number;
  setPlansScrollPosition: (scrollPosition: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  plansScrollPosition: state.shared.scrollPosition.explorer.plans,
});

const mapDispatchToProps = (dispatch) => ({
  setPlansScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerPlansScrollPosition(scrollPosition)),
});

const AcademicPlanBrowserView: React.FC<AcademicPlanBrowserViewProps> = ({ favoritePlans, academicPlans, plansScrollPosition, setPlansScrollPosition }) => {
  const cardGroupElement: HTMLElement = document.getElementById('academicPlansCardGroup');
  useEffect(() => {
    const savedScrollPosition = plansScrollPosition;
    if (savedScrollPosition && cardGroupElement) {
      cardGroupElement.scrollTo(0, savedScrollPosition);
    }
    return () => {
      if (cardGroupElement) {
        const currentScrollPosition = cardGroupElement.scrollTop;
        setPlansScrollPosition(currentScrollPosition);
      }
    };
  }, [cardGroupElement, plansScrollPosition, setPlansScrollPosition]);

  return (
    <div id="academic-plan-browser-view">
      <Segment>
        <Header dividing>ACADEMIC PLANS {academicPlans.length}</Header>
        <Card.Group itemsPerRow={2} stackable id="academicPlansCardGroup">
          {academicPlans.map((plan) => (
            <AcademicPlanCard key={plan._id} item={plan} type={EXPLORER_TYPE.ACADEMICPLANS} />))}
        </Card.Group>
      </Segment>
    </div>
  );
};

const AcademicPlanBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(AcademicPlanBrowserView);

export default AcademicPlanBrowserViewContainer;
