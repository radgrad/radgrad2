import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { AcademicPlan } from '../../../../typings/radgrad';
import AcademicPlanStaticYearView from './AcademicPlanStaticYearView';

interface AcademicPlanStaticViewerProps {
  plan: AcademicPlan;
  takenSlugs: string[];
}

const AcademicPlanStaticViewer: React.FC<AcademicPlanStaticViewerProps> = ({ plan, takenSlugs }) => {
  const equalWidthGridStyle = { margin: 0 };
  const match = useRouteMatch();
  const fiveYear = (plan.coursesPerAcademicTerm.length % 5) === 0;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  const username = match.params.username;

  return (
    <div className="ui padded container">
      <Grid stackable>
        <Grid.Column>
          <Grid columns="equal" style={equalWidthGridStyle}>
            <Grid.Row columns={fiveYear ? 5 : 4}>
              <Grid.Column style={littlePadding}>
                <AcademicPlanStaticYearView
                  yearNumber={yearNumber++}
                  academicPlan={plan}
                  username={username}
                  takenSlugs={takenSlugs}
                />
              </Grid.Column>
              <Grid.Column style={littlePadding}>
                <AcademicPlanStaticYearView
                  yearNumber={yearNumber++}
                  academicPlan={plan}
                  username={username}
                  takenSlugs={takenSlugs}
                />
              </Grid.Column>
              <Grid.Column style={littlePadding}>
                <AcademicPlanStaticYearView
                  yearNumber={yearNumber++}
                  academicPlan={plan}
                  username={username}
                  takenSlugs={takenSlugs}
                />
              </Grid.Column>
              <Grid.Column style={littlePadding}>
                <AcademicPlanStaticYearView
                  yearNumber={yearNumber++}
                  academicPlan={plan}
                  username={username}
                  takenSlugs={takenSlugs}
                />
              </Grid.Column>
              {fiveYear ? (
                <Grid.Column style={littlePadding}>
                  <AcademicPlanStaticYearView
                    yearNumber={yearNumber++}
                    academicPlan={plan}
                    username={username}
                    takenSlugs={takenSlugs}
                  />
                </Grid.Column>
              ) : ''}
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AcademicPlanStaticViewer;
