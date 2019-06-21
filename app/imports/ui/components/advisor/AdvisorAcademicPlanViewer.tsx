import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import LandingAcademicPlanYearView from '../landing/LandingAcademicPlanYearView';

interface IAcademicPlanViewerProps {
  plan: IAcademicPlan;
}

const AdvisorAcademicPlanViewer = (props: IAcademicPlanViewerProps) => {
  const numYears = (props.plan.coursesPerAcademicTerm.length % 5) === 0 ? 5 : 4;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Grid stackable={true} padded={true}>
      <Grid.Row columns={numYears}>
        <Grid.Column style={littlePadding}>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
        </Grid.Column>
        <Grid.Column>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
        </Grid.Column>
        <Grid.Column>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
        </Grid.Column>
        <Grid.Column>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
        </Grid.Column>
        {numYears === 5 ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
          </Grid.Column>
        ) : ''}
      </Grid.Row>
    </Grid>
  );
};

export default AdvisorAcademicPlanViewer;
