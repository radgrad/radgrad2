import React, { useEffect } from 'react';
import { connect } from 'react-redux';
// import { useParams, useRouteMatch } from 'react-router-dom';
// import _ from 'lodash';
import { Card, Header, Segment } from 'semantic-ui-react';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { IAcademicPlan, IFavoriteAcademicPlan } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import AcademicPlanCard from './AcademicPlanCard';

interface IAcademicPlanBrowserViewProps {
  favoritePlans: IFavoriteAcademicPlan[];
  academicPlans: IAcademicPlan[];
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

const AcademicPlanBrowserView: React.FC<IAcademicPlanBrowserViewProps> = (props) => {
  // console.log(props);
  const cardGroupElement: HTMLElement = document.getElementById('academicPlansCardGroup');
  useEffect(() => {
    const savedScrollPosition = props.plansScrollPosition;
    if (savedScrollPosition && cardGroupElement) {
      cardGroupElement.scrollTo(0, savedScrollPosition);
    }
    return () => {
      if (cardGroupElement) {
        const currentScrollPosition = cardGroupElement.scrollTop;
        props.setPlansScrollPosition(currentScrollPosition);
      }
    };
  }, [cardGroupElement, props.plansScrollPosition, props.setPlansScrollPosition]);

  return (
    <div id="academic-plan-browser-view">
      <Segment>
        <Header dividing>ACADEMIC PLANS {props.academicPlans.length}</Header>
        <Card.Group itemsPerRow={2} stackable id="academicPlansCardGroup">
          {props.academicPlans.map((plan) => (
            <AcademicPlanCard key={plan._id} item={plan} type={EXPLORER_TYPE.ACADEMICPLANS} />))}
        </Card.Group>
      </Segment>
    </div>
  );
};

const AcademicPlanBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(AcademicPlanBrowserView);

export default AcademicPlanBrowserViewContainer;
