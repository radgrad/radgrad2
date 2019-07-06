import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import LandingAcademicPlanYearView from '../landing/LandingAcademicPlanYearView';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface IAcademicPlanViewerProps {
  plan: IAcademicPlan;
}

const AdvisorAcademicPlanViewer = (props: IAcademicPlanViewerProps) => {
  // console.log('plan viewer', props.plan);
  const quarterSystem = RadGradSettings.findOne({}).quarterSystem;
  const termsPerYear = quarterSystem ? 4 : 3;
  const numYears = props.plan.coursesPerAcademicTerm.length / termsPerYear;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Grid stackable={true} padded={true}>
      <Grid.Row columns="equal">
        <Grid.Column style={littlePadding}>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
        </Grid.Column>
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
          </Grid.Column>
        ) : ''}
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
          </Grid.Column>
        ) : ''}
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
          </Grid.Column>
        ) : ''}
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.plan}/>
          </Grid.Column>
        ) : ''}
      </Grid.Row>
    </Grid>
  );
};

export default AdvisorAcademicPlanViewer;
