import * as React from 'react';
import { Grid, Label } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../typings/radgrad';
import { getPlanChoices } from '../../../api/degree-plan/AcademicPlanUtilities';

interface IAcademicPlanViewerWidgetProps {
  academicPlan: IAcademicPlan;
}

class AcademicPlanViewerWidget extends React.Component<IAcademicPlanViewerWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const quarter = this.props.academicPlan.coursesPerAcademicTerm.length % 4 === 0;
    const fiveYear = this.props.academicPlan.coursesPerAcademicTerm.length % 5 === 0;
    let termNum = 0;
    console.log(getPlanChoices(this.props.academicPlan, termNum), getPlanChoices(this.props.academicPlan, termNum + 4));
    return (
      <Grid>
        <Grid.Row>
          <Label>{quarter ? 'Quarter' : 'Semester'} {fiveYear ? 'BAM' : 'Bachelors'}</Label>
        </Grid.Row>
        <Grid.Row columns={fiveYear ? 5 : 4}>
          <Grid.Column>
            Year 1<br/>
            Fall <br/>
            {getPlanChoices(this.props.academicPlan, termNum++).join(',')}
            {quarter ? (<div>Winter <br/>{getPlanChoices(this.props.academicPlan, termNum++).join(',')} </div>) : ''}
            Spring <br/>
            {getPlanChoices(this.props.academicPlan, termNum++).join(',')}
            Summer <br/>
            {getPlanChoices(this.props.academicPlan, termNum++).join(',')}
          </Grid.Column>
          <Grid.Column>
            Year 2
          </Grid.Column>
          <Grid.Column>
            Year 3
          </Grid.Column>
          <Grid.Column>
            Year 4
          </Grid.Column>
          {fiveYear ? (
            <Grid.Column>
              Year 5
            </Grid.Column>
          ) : ''}
        </Grid.Row>
      </Grid>
    );
  }
}

export default AcademicPlanViewerWidget;
