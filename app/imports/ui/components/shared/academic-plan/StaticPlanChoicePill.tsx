import React from 'react';
import { Grid } from 'semantic-ui-react';
import { getNotSatisfiedStyle, getSatisfiedStyle } from './StyleFunctions';
import NamePill from './NamePill';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';

interface IPlanChoicePillProps {
  choice: string;
  satisfied: boolean;
}

const StaticPlanChoicePill = (props: IPlanChoicePillProps) => {
  const style = props.satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
  return (
    <Grid.Row style={style}>
      <NamePill name={PlanChoices.toString(props.choice)} />
    </Grid.Row>
  );
};

export default StaticPlanChoicePill;
