import React from 'react';
import { Grid } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../../typings/radgrad';
import LandingAcademicPlanYearView from './LandingAcademicPlanYearView';

interface ILandingAcademicPlanViewerProps {
  plan: IAcademicPlan;
}

const LandingAcademicPlanViewer: React.FC<ILandingAcademicPlanViewerProps> = ({ plan }) => {
  // console.log(plan);
  const numYears = (plan.coursesPerAcademicTerm.length % 5) === 0 ? 5 : 4;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Grid stackable padded>
      <Grid.Row columns={numYears}>
        <Grid.Column style={littlePadding}>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
        </Grid.Column>
        <Grid.Column>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
        </Grid.Column>
        <Grid.Column>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
        </Grid.Column>
        <Grid.Column>
          <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
        </Grid.Column>
        {numYears === 5 ? (
          <Grid.Column>
            <LandingAcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} />
          </Grid.Column>
        ) : ''}
      </Grid.Row>
    </Grid>
  );
};

export default LandingAcademicPlanViewer;
