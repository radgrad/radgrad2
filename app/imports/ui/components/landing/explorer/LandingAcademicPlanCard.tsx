import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getSlug, itemShortDescription } from '../helper-functions';
import { IAcademicPlan } from '../../../../typings/radgrad';
import LandingAcademicPlanViewer from './LandingAcademicPlanViewer';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface ILandingAcademicPlanCardProps {
  plan: IAcademicPlan;
}

const LandingAcademicPlanCard = (props: ILandingAcademicPlanCardProps) => {
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${getSlug(props.plan)}`;
  const title = props.plan.name;
  return (
    <Card className="ui card radgrad-interest-card">
      <Card.Content className="content">
        <div className="header">{title}</div>
      </Card.Content>
      <Card.Content className="content">
        <p>
          {itemShortDescription(props.plan)}
          ...
        </p>
        <LandingAcademicPlanViewer plan={props.plan} />
      </Card.Content>
      <Button.Group attached="bottom" className="radgrad-home-buttons ui center aligned three bottom attached {{hidden}} buttons">
        <a href={routeToItem} className="ui button">
          <Icon name="chevron circle right" />
          <br />
          View More
        </a>
      </Button.Group>
    </Card>
  );
};

const LandingAcademicPlanCardContainer = withRouter(LandingAcademicPlanCard);
export default LandingAcademicPlanCardContainer;
