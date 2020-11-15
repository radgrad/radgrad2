import React from 'react';
import { Header, Grid, List, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Courses } from '../../../../../../api/course/CourseCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { EXPLORER_TYPE } from '../../../../../layouts/utilities/route-constants';

interface IInterestedRelatedWidgetProps {
  relatedCourses: any;
  relatedOpportunities: any;
  isStudent: boolean;
  baseURL: string;
}

const InterestedRelatedWidget = (props: IInterestedRelatedWidgetProps) => (
  <div>
    <Segment>
      <Header dividing>RELATED COURSES</Header>
      {props.isStudent ? (
        <Grid columns={3} stackable celled="internally">
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
            <List>
              {props.relatedCourses.completed.length === 0 ? 'None' :
                _.map(props.relatedCourses.completed, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${props.baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
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
              {props.relatedCourses.inPlan.length === 0 ? 'None' :
                _.map(props.relatedCourses.inPlan, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${props.baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
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
              {props.relatedCourses.notInPlan.length === 0 ? 'None' :
                _.map(props.relatedCourses.notInPlan, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${props.baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
                  return (
                    <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
        </Grid>
      ) : (
        <List horizontal bulleted>
          {_.map(props.relatedCourses.notInPlan, (courseID) => {
            const course = Courses.findDoc(courseID);
            const slug = Slugs.getNameFromID(course.slugID);
            const url = `${props.baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
            return (
              <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
            );
          })}
        </List>
      )}
    </Segment>
    <Segment>
      <Header dividing>RELATED OPPORTUNITIES</Header>
      {props.isStudent ? (
        <Grid columns={3} stackable celled="internally">
          <Grid.Column textAlign="center">
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
            <List>
              {props.relatedOpportunities.completed.length === 0 ? 'None' :
                _.map(props.relatedOpportunities.completed, (opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${props.baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
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
              {props.relatedOpportunities.inPlan.length === 0 ? 'None' :
                _.map(props.relatedOpportunities.inPlan, (opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${props.baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
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
              {props.relatedOpportunities.notInPlan.length === 0 ? 'None' :
                _.map(props.relatedOpportunities.notInPlan, (opportunityID) => {
                  const opportunity = Opportunities.findDoc(opportunityID);
                  const slug = Slugs.getNameFromID(opportunity.slugID);
                  const url = `${props.baseURL}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
                  return (
                    <List.Item key={opportunity._id}><Link to={url}>{opportunity.name}</Link></List.Item>
                  );
                })}
            </List>
          </Grid.Column>
        </Grid>
      ) : (
        <List horizontal bulleted>
          {_.map(props.relatedOpportunities.notInPlan, (opportunityID) => {
            const opportunity = Opportunities.findDoc(opportunityID);
            const slug = Slugs.getNameFromID(opportunity.slugID);
            const url = `${props.baseURL}/${EXPLORER_TYPE.COURSES}/${slug}`;
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
