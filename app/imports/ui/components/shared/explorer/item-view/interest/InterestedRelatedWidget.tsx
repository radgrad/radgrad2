import React from 'react';
import { Header, Grid, List, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
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
      <Header dividing>RELATED COURSES</Header>
      {isStudent ? (
        <Grid columns={3} stackable celled="internally">
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
            <List>
              {relatedCourses.completed.length === 0 ? 'None' :
                _.map(relatedCourses.completed, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                    <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
            <List>
              {relatedCourses.inPlan.length === 0 ? 'None' :
                _.map(relatedCourses.inPlan, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                    <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
            <List>
              {relatedCourses.notInPlan.length === 0 ? 'None' :
                _.map(relatedCourses.notInPlan, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                    <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
        </Grid>
      ) : (
        <List horizontal bulleted>
          {_.map(relatedCourses.notInPlan, (courseID) => {
            const course = Courses.findDoc(courseID);
            const slug = Slugs.getNameFromID(course.slugID);
            const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
            return (
              <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
            );
          })}
        </List>
      )}
    </Segment>
    <Segment>
      <Header dividing>RELATED OPPORTUNITIES</Header>
      {isStudent ? (
        <Grid columns={3} stackable celled="internally">
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
            <List>
              {relatedOpportunities.completed.length === 0 ? 'None' :
                _.map(relatedOpportunities.completed, (opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                    <List.Item key={opportunity._id}><Link to={url}>{opportunity.shortName}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
            <List>
              {relatedOpportunities.inPlan.length === 0 ? 'None' :
                _.map(relatedOpportunities.inPlan, (opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                    <List.Item key={opportunity._id}><Link to={url}>{opportunity.shortName}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
            <List>
              {relatedOpportunities.notInPlan.length === 0 ? 'None' :
                _.map(relatedOpportunities.notInPlan, (opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                    <List.Item key={opportunity._id}><Link to={url}>{opportunity.name}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
        </Grid>
      ) : (
        <List horizontal bulleted>
          {_.map(relatedOpportunities.notInPlan, (opportunityID) => {
            const opportunity = Opportunities.findDoc(opportunityID);
            const slug = Slugs.getNameFromID(opportunity.slugID);
            const url = `${baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
            return (
              <List.Item key={opportunity._id}><Link to={url}>{opportunity.name}</Link></List.Item>
            );
          })}
        </List>
      )}
    </Segment>
  </div>
);

export default InterestedRelatedWidget;
