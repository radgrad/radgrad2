import React from 'react';
import { Grid } from 'semantic-ui-react';
import { AcademicPlan } from '../../../../typings/radgrad';
import AcademicPlanYearView from '../../shared/academic-plan/AcademicPlanYearView';

interface AcademicPlanViewerWidgetProps {
  academicPlan: AcademicPlan;
  username: string;
  takenSlugs: string[];
}

const AcademicPlanViewerWidget: React.FC<AcademicPlanViewerWidgetProps> = ({ academicPlan, username, takenSlugs }) => {
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
