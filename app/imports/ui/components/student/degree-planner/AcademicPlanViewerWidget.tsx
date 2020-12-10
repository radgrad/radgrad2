import React from 'react';
import { Grid } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../../typings/radgrad';
import AcademicPlanYearView from '../../shared/academic-plan/AcademicPlanYearView';

interface IAcademicPlanViewerWidgetProps {
  academicPlan: IAcademicPlan;
  username: string;
  takenSlugs: string[];
}

const AcademicPlanViewerWidget: React.FC<IAcademicPlanViewerWidgetProps> = ({ academicPlan, username, takenSlugs }) => {
  const fiveYear = (academicPlan.coursesPerAcademicTerm.length % 5) === 0;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Grid>
      <Grid.Row columns={fiveYear ? 5 : 4}>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={academicPlan}
            username={username}
            takenSlugs={takenSlugs}
          />
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={academicPlan}
            username={username}
            takenSlugs={takenSlugs}
          />
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={academicPlan}
            username={username}
            takenSlugs={takenSlugs}
          />
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={academicPlan}
            username={username}
            takenSlugs={takenSlugs}
          />
        </Grid.Column>
        {fiveYear ?
          (
            <Grid.Column style={littlePadding}>
              <AcademicPlanYearView
                yearNumber={yearNumber++}
                academicPlan={academicPlan}
                username={username}
                takenSlugs={takenSlugs}
              />
            </Grid.Column>
          )
          : ''}
      </Grid.Row>
    </Grid>
  );
};

export default AcademicPlanViewerWidget;
