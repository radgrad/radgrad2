import React from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import CourseList from '../../../CourseList';
import OpportunityList from '../../../OpportunityList';

interface InterestedRelatedWidgetProps {
  relatedCourses: any; // TODO we should type this.
  relatedOpportunities: any;
  isStudent: boolean;
  baseURL: string;
}

const InterestedRelated: React.FC<InterestedRelatedWidgetProps> = ({ relatedCourses, baseURL, isStudent, relatedOpportunities }) => (
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
            <CourseList courses={relatedCourses.completed.map((id) => Courses.findDoc(id))} keyStr="completed" size="large"/>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
          </Grid.Row>
          <Grid.Row>
            <CourseList courses={relatedCourses.inPlan.map((id) => Courses.findDoc(id))} keyStr="inPlan" size="large"/>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
          </Grid.Row>
          <Grid.Row>
            <CourseList courses={relatedCourses.notInPlan.map((id) => Courses.findDoc(id))} keyStr="notInPlan" size="large"/>
          </Grid.Row>
        </Grid>
      ) : (
        <CourseList courses={relatedCourses.notInPlan.map((id) => Courses.findDoc(id))} keyStr="notInPlan" size="large" />
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
            <OpportunityList opportunities={relatedOpportunities.completed.map((id) => Opportunities.findDoc(id))} size="large" keyStr="completedOpp" />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
          </Grid.Row>
          <Grid.Row>
            <OpportunityList opportunities={relatedOpportunities.inPlan.map((id) => Opportunities.findDoc(id))} size="large" keyStr="oppInPlan" />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
          </Grid.Row>
          <Grid.Row>
            <OpportunityList opportunities={relatedOpportunities.notInPlan.map((id) => Opportunities.findDoc(id))} size="large" keyStr="oppNotInPlan" />
          </Grid.Row>
        </Grid>
      ) : (
        <OpportunityList opportunities={relatedOpportunities.notInPlan.map((id) => Opportunities.findDoc(id))} size="large" keyStr="oppsNotInPlan" />
      )}
    </Segment>
  </div>
);

export default InterestedRelated;
