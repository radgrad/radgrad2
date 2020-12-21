import React from 'react';
import { Grid } from 'semantic-ui-react';
import { getSatisfiedStyle } from '../shared/academic-plan/utilities/styles';
import NamePill from '../shared/academic-plan/NamePill';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

interface LandingPlanChoicePillProps {
  choice: string;
}

const LandingPlanChoicePill: React.FC<LandingPlanChoicePillProps> = ({ choice }) => (
  <Grid.Row style={getSatisfiedStyle()}>
    <NamePill name={PlanChoices.toString(choice)} />
  </Grid.Row>
);

export default LandingPlanChoicePill;