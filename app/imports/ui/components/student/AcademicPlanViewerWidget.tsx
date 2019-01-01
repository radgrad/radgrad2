import * as React from 'react';
import { Grid, Label } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../typings/radgrad';
import AcademicPlanYearView from '../shared/AcademicPlanYearView';

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
    let yearNumber = 0;
    const littlePadding = {
      paddingLeft: 2,
      paddingRight: 2,
    };
    return (
      <Grid>
        <Grid.Row>
          <Label>{quarter ? 'Quarter' : 'Semester'} {fiveYear ? 'BAM' : 'Bachelors'}</Label>
        </Grid.Row>
        <Grid.Row columns={fiveYear ? 5 : 4}>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}/>
          </Grid.Column>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}/>
          </Grid.Column>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}/>
          </Grid.Column>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}/>
          </Grid.Column>
          {fiveYear ? (
            <Grid.Column style={littlePadding}>
              <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}/>
            </Grid.Column>
          ) : ''}
        </Grid.Row>
      </Grid>
    );
  }
}

export default AcademicPlanViewerWidget;
