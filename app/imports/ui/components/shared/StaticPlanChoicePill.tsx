import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { getNotSatisfiedStyle, getSatisfiedStyle } from './StyleFunctions';
import NamePill from './NamePill';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';

interface IPlanChoicePillProps {
  choice: string;
  index: number;
  satisfied: boolean;
}

class StaticPlanChoicePill extends React.Component<IPlanChoicePillProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const style = this.props.satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
    return (
      <Grid.Row style={style}>
        <NamePill name={PlanChoiceCollection.toStringFromSlug(this.props.choice)}/>
      </Grid.Row>
    );
  }
}

export default StaticPlanChoicePill;
