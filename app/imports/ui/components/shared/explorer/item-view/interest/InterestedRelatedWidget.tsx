import React from 'react';
import { Header, Grid, List, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { EXPLORER_TYPE } from '../../../../../layouts/utilities/route-constants';

interface InterestedRelatedWidgetProps {
  relatedCourses: any; // TODO we should type this.
  relatedOpportunities: any;
  isStudent: boolean;
  baseURL: string;
}

const InterestedRelatedWidget: React.FC<InterestedRelatedWidgetProps> = ({ relatedCourses, baseURL, isStudent, relatedOpportunities }) => (
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
            <List bulleted>
              {relatedCourses.completed.length === 0
                ? 'None'
                : relatedCourses.completed.map((courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                      <List.Item key={course._id}>
                        <Link to={url}>{course.shortName}</Link>
                      </List.Item>
                  );
                })}
            </List>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
            <List bulleted>
              {relatedCourses.inPlan.length === 0
                ? 'None'
                : relatedCourses.inPlan.map((courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                      <List.Item key={course._id}>
                        <Link to={url}>{course.shortName}</Link>
                      </List.Item>
                  );
                })}
            </List>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
            <List bulleted>
              {relatedCourses.notInPlan.length === 0
                ? 'None'
                : relatedCourses.notInPlan.map((courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                      <List.Item key={course._id}>
                        <Link to={url}>{course.shortName}</Link>
                      </List.Item>
                  );
                })}
            </List>
          </Grid.Row>
        </Grid>
      ) : (
        <List horizontal bulleted>
          {relatedCourses.notInPlan.map((courseID) => {
            const course = Courses.findDoc(courseID);
            const slug = Slugs.getNameFromID(course.slugID);
            const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
            return (
              <List.Item key={course._id}>
                <Link to={url}>{course.shortName}</Link>
              </List.Item>
            );
          })}
        </List>
      )}
    </Segment>
    <Segment>
      <Header dividing><Icon name="lightbulb" /> RELATED OPPORTUNITIES</Header>
      {isStudent ? (
        <Grid stackable celled="internally" padded>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
            <List>
              {relatedOpportunities.completed.length === 0
                ? 'None'
                : relatedOpportunities.completed.map((opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                      <List.Item key={opportunity._id}>
                        <Link to={url}>{opportunity.shortName}</Link>
                      </List.Item>
                  );
                })}
            </List>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
            <List>
              {relatedOpportunities.inPlan.length === 0
                ? 'None'
                : relatedOpportunities.inPlan.map((opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                      <List.Item key={opportunity._id}>
                        <Link to={url}>{opportunity.shortName}</Link>
                      </List.Item>
                  );
                })}
            </List>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
            <List>
              {relatedOpportunities.notInPlan.length === 0
                ? 'None'
                : relatedOpportunities.notInPlan.map((opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                      <List.Item key={opportunity._id}>
                        <Link to={url}>{opportunity.name}</Link>
                      </List.Item>
                  );
                })}
            </List>
          </Grid.Row>
        </Grid>
      ) : (
        <List horizontal bulleted>
          {relatedOpportunities.notInPlan.map((opportunityID) => {
            const opportunity = Opportunities.findDoc(opportunityID);
            const slug = Slugs.getNameFromID(opportunity.slugID);
            const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
            return (
              <List.Item key={opportunity._id}>
                <Link to={url}>{opportunity.name}</Link>
              </List.Item>
            );
          })}
        </List>
      )}
    </Segment>
  </div>
);

export default InterestedRelatedWidget;
