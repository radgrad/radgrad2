import React from 'react';
import { Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { gradeCompetency } from '../../../../api/ice/IceProcessor';
import { ProfileCourse, ProfileInterest } from '../../../../typings/radgrad';
import StudentRecommendedCourseItem from '../shared/StudentRecommendedCourseItem';
import PageIceCircle from './PageIceCircle';
import { getRecommendedCourses } from './utilities/recommended';

interface CompetencyIceTabPaneProps {
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  projectedICE: number;
  earnedICE: number;
}

export const CompetencyIceTabPane: React.FC<CompetencyIceTabPaneProps> = ({ projectedICE, earnedICE, profileCourses, profileInterests }) => {
  const interestIDs = profileInterests.map((pi) => pi.interestID);
  const recommended = getRecommendedCourses(interestIDs, projectedICE);
  return (
    <Tab.Pane>
      <Segment basic>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column textAlign='left' width={4}>
              <PageIceCircle earned={earnedICE} planned={projectedICE} type="comp" />
            </Grid.Column>
            <Grid.Column textAlign='left' width={12}>
              <Header as="h3" textAlign="center" className="ice-competency-color">
                COMPETENCY
              </Header>
              <p>You earn competency points by completing classes. The number of competency points depends upon your grade: you get <strong>{gradeCompetency.A} points for any kind of A, {gradeCompetency.B} points for any kind of B, and {gradeCompetency.C} points for a C or below</strong>.</p>
              <p>You have <strong>{earnedICE}</strong> verified experience points. This appears as a number in the center of the circle. It is also represented by the darkly colored portion of the circle. You have <strong>{projectedICE}</strong> unverified experience points. This appears as the lightly colored portion of the circle.</p>
              {projectedICE < 100 ? <div>
                <p>You don&quot;t have enough competency from courses in your degree experience plan. Here are some recommended courses that match your interests:</p>
                <Grid stackable>
                  {recommended.map((c) => <StudentRecommendedCourseItem courseID={c._id} key={c._id} />)}
                </Grid>
              </div> : ''}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Tab.Pane>
  );
};
