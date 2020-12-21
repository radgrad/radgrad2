import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { getSlug, itemShortDescription } from '../utilities/helper-functions';
import { AcademicPlan } from '../../../../typings/radgrad';
import LandingAcademicPlanViewer from './LandingAcademicPlanViewer';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface LandingAcademicPlanCardProps {
  plan: AcademicPlan;
}

const LandingAcademicPlanCard: React.FC<LandingAcademicPlanCardProps> = ({ plan }) => {
  const routeToItem = `#/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${getSlug(plan)}`;
  const title = plan.name;
  return (
    <Card className="ui card radgrad-interest-card">
      <Card.Content className="content">
        <div className="header">{title}</div>
      </Card.Content>
      <Card.Content className="content">
        <p>
          {itemShortDescription(plan)}
          ...
        </p>
        <LandingAcademicPlanViewer plan={plan} />
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

export default LandingAcademicPlanCard;
