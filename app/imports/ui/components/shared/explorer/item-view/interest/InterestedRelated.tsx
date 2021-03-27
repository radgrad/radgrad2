import React from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { Profile, RelatedCoursesOrOpportunities } from '../../../../../../typings/radgrad';
import CourseList from '../../../CourseList';
import OpportunityList from '../../../OpportunityList';

interface InterestedRelatedWidgetProps {
  relatedCourses: RelatedCoursesOrOpportunities;
  relatedOpportunities: RelatedCoursesOrOpportunities;
  isStudent: boolean;
  baseURL: string;
  profile: Profile;
}

const InterestedRelated: React.FC<InterestedRelatedWidgetProps> = ({ relatedCourses, baseURL, isStudent, relatedOpportunities, profile }) => (
  <div>
    <Segment>
      <Header dividing><Icon name="book"/> RELATED COURSES</Header>
      {isStudent ? (
        <Grid stackable padded>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="check circle" color="green" />
              Completed
            </Header>
          </Grid.Row>
          <Grid.Row>
            <CourseList courses={relatedCourses.completed.map((id) => Courses.findDoc(id))} keyStr="completed" size="medium" userID={profile.userID} />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
          </Grid.Row>
          <Grid.Row>
            <CourseList courses={relatedCourses.inPlan.map((id) => Courses.findDoc(id))} keyStr="inPlan" size="medium" userID={profile.userID} />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
          </Grid.Row>
          <Grid.Row>
            <CourseList courses={relatedCourses.notInPlan.map((id) => Courses.findDoc(id))} keyStr="notInPlan" size="medium" userID={profile.userID} />
          </Grid.Row>
        </Grid>
      ) : (
        <CourseList courses={relatedCourses.notInPlan.map((id) => Courses.findDoc(id))} keyStr="notInPlan" size="medium" userID={profile.userID} />
      )}
    </Segment>
    <Segment>
      <Header dividing><Icon name="lightbulb" /> RELATED OPPORTUNITIES</Header>
      {isStudent ? (
        <Grid stackable padded>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
          </Grid.Row>
          <Grid.Row>
            <OpportunityList opportunities={relatedOpportunities.completed.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="completedOpp" userID={profile.userID} />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
          </Grid.Row>
          <Grid.Row>
            <OpportunityList opportunities={relatedOpportunities.inPlan.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="oppInPlan" userID={profile.userID} />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
          </Grid.Row>
          <Grid.Row>
            <OpportunityList opportunities={relatedOpportunities.notInPlan.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="oppNotInPlan" userID={profile.userID} />
          </Grid.Row>
        </Grid>
      ) : (
        <OpportunityList opportunities={relatedOpportunities.notInPlan.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="oppsNotInPlan" userID={profile.userID} />
      )}
    </Segment>
  </div>
);

export default InterestedRelated;
