import React from 'react';
import { Grid } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { AcademicPlan } from '../../../../typings/radgrad';
import LandingAcademicPlanYearView from '../../landing/explorer/LandingAcademicPlanYearView';

interface AcademicPlanViewerProps {
  plan: AcademicPlan;
}

const AdvisorAcademicPlanViewer: React.FC<AcademicPlanViewerProps> = ({ plan }) => {
  // console.log('plan viewer', props.plan);
  const quarterSystem = RadGradProperties.getQuarterSystem();
  const termsPerYear = quarterSystem ? 4 : 3;
  const numYears = plan.coursesPerAcademicTerm.length / termsPerYear;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Grid stackable padded>
      <Grid.Row columns="equal">
        <Grid.Column style={littlePadding}>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
        </Grid.Column>
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
          </Grid.Column>
        ) : ''}
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
          </Grid.Column>
        ) : ''}
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
          </Grid.Column>
        ) : ''}
        {yearNumber < numYears ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
          </Grid.Column>
        ) : ''}
      </Grid.Row>
    </Grid>
  );
};

export default AdvisorAcademicPlanViewer;
