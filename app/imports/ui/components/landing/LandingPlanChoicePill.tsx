import React from 'react';
import { Grid } from 'semantic-ui-react';
import { getSatisfiedStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

interface ILandingPlanChoicePillProps {
  choice: string;
}

const LandingPlanChoicePill = (props: ILandingPlanChoicePillProps) => (
  <Grid.Row style={getSatisfiedStyle()}>
    <NamePill name={PlanChoices.toString(props.choice)} />
  </Grid.Row>
);

export default LandingPlanChoicePill;
