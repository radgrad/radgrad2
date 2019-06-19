import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { getNonStudentStyle, getNotSatisfiedStyle, getSatisfiedStyle } from './StyleFunctions';
import NamePill from './NamePill';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';

interface ISatisfiedPlanChoicePillProps {
  choice: string;
  index: number;
  satisfied: boolean;
  role: string;
}

const SatisfiedPlanChoicePill = (props: ISatisfiedPlanChoicePillProps) => {
  const style = props.satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
  const isRoleStudent = props.role === 'student';

  return (
    <Grid.Row style={isRoleStudent ? style : getNonStudentStyle()}>
      <NamePill name={PlanChoiceCollection.toStringFromSlug(props.choice)}/>
    </Grid.Row>
  );
};

export default SatisfiedPlanChoicePill;
