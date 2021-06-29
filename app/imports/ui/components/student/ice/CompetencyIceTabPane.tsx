import React from 'react';
import { Grid, Header, List, Segment, Tab } from 'semantic-ui-react';
import { gradeCompetency } from '../../../../api/ice/IceProcessor';
import { ProfileCourse, ProfileInterest } from '../../../../typings/radgrad';
import CourseList from '../../shared/CourseList';
import PageIceCircle from './PageIceCircle';
import { getRecommendedCourses } from './utilities/recommended';

interface CompetencyIceTabPaneProps {
  profileID: string;
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  projectedICE: number;
  earnedICE: number;
}

export const CompetencyIceTabPane: React.FC<CompetencyIceTabPaneProps> = ({ profileID, projectedICE, earnedICE, profileCourses, profileInterests }) => {
  const interestIDs = profileInterests.map((pi) => pi.interestID);
  const recommended = getRecommendedCourses(interestIDs, projectedICE, profileID);
  return (
    <Tab.Pane>
      <Segment basic>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column textAlign='left' width={4}>
              <PageIceCircle earned={earnedICE} planned={projectedICE} type="comp" />
            </Grid.Column>
            <Grid.Column textAlign='left' width={12}>
              <Header as="h3" className="ice-competency-color">
                COMPETENCY
              </Header>
              <p>You earn Competency points by completing courses. The number of Competency points depends upon your grade: you get <strong>{gradeCompetency.A} points for any kind of A, {gradeCompetency.B} points for any kind of B, and {gradeCompetency.C} points for a C or below</strong>.</p>
              <p>Right now, you have <strong>{earnedICE}</strong> verified Competency points. This appears as the number in the center of the first circle (although the displayed value is capped at 100). Your verified points are also represented by the darkly colored portion of the circle. Only verified points enable you to achieve new Levels in RadGrad.</p>
              <p>Your grand total for Competency is <strong>{projectedICE}</strong>. This includes both verified Courses plus Courses that you have planned to take in future.  If some of your planned Courses have not yet been completed, then you might see these points represented as a lightly colored portion of the circle.</p>
              {projectedICE < 100 ? <div>
                <p>You don&quot;t have enough competency from courses in your degree experience plan. Here are some recommended courses that match your interests:</p>
                <CourseList courses={recommended} keyStr='recommended' size='large' userID={profileID} />
                <List ordered>
                  <List.Item>View the course by clicking on the label.</List.Item>
                  <List.Item>If you like the course, add it to your profile.</List.Item>
                  <List.Item>Then go to the Planner page and add the course to your degree experience plan.</List.Item>
                </List>
              </div> : ''}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Tab.Pane>
  );
};
