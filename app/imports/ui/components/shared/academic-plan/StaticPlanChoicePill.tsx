import React from 'react';
import { Grid } from 'semantic-ui-react';
import { getNotSatisfiedStyle, getSatisfiedStyle } from './utilities/styles';
import NamePill from './NamePill';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';

interface PlanChoicePillProps {
  choice: string;
  satisfied: boolean;
}

const StaticPlanChoicePill: React.FC<PlanChoicePillProps> = ({ choice, satisfied }) => {
  const style = satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
  return (
    <Grid.Row style={style}>
      <NamePill name={PlanChoices.toString(choice)} />
    </Grid.Row>
  );
};

export default StaticPlanChoicePill;
