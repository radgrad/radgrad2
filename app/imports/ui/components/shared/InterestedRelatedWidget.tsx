import * as React from 'react';
import { Header, Grid, List, Segment, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Link } from 'react-router-dom';
import { Courses } from '../../../api/course/CourseCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

interface IInterestedRelatedWidgetProps {
  relatedCourses: any;
  relatedOpportunities: any;
  isStudent: boolean;
  baseURL: string;
}

class  InterestedRelatedWidget extends React.Component<IInterestedRelatedWidgetProps> {
  constructor(props) {
    super(props);
    // console.log(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        <Segment>
          <Header dividing={true}>RELATED COURSES</Header>
          {this.props.isStudent ? (
            <Grid columns={3} stackable={true} celled={'internally'}>
              <Grid.Column textAlign='center'>
                <Header as='h4'><Icon name='checkmark' color='green'/>Completed</Header>
                <List>
                {this.props.relatedCourses.completed.length === 0 ? 'None' :
                  _.map(this.props.relatedCourses.completed, (courseID) => {
                  const course = Courses.findDoc(courseID);
                  const slug = Slugs.getNameFromID(course.slugID);
                  const url = `${this.props.baseURL}/courses/${slug}`;
                  return (
                    <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                  );
                })}
                </List>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h4'><Icon name='warning sign' color='yellow'/>In Plan (Not Yet Completed)</Header>
                <List>
                  {this.props.relatedCourses.inPlan.length === 0 ? 'None' :
                    _.map(this.props.relatedCourses.inPlan, (courseID) => {
                    const course = Courses.findDoc(courseID);
                    const slug = Slugs.getNameFromID(course.slugID);
                    const url = `${this.props.baseURL}/courses/${slug}`;
                    return (
                      <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                    );
                  })}
                </List>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h4'><Icon name='warning circle' color='red'/>Not In Plan</Header>
                <List>
                  {this.props.relatedCourses.notInPlan.length === 0 ? 'None' :
                    _.map(this.props.relatedCourses.notInPlan, (courseID) => {
                      const course = Courses.findDoc(courseID);
                      const slug = Slugs.getNameFromID(course.slugID);
                      const url = `${this.props.baseURL}/courses/${slug}`;
                      return (
                        <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                      );
                    })}
                </List>
              </Grid.Column>
            </Grid>
          ) : (
            <List horizontal={true} bulleted={true}>
              {_.map(this.props.relatedCourses.notInPlan, (courseID) => {
                const course = Courses.findDoc(courseID);
                const slug = Slugs.getNameFromID(course.slugID);
                const url = `${this.props.baseURL}/courses/${slug}`;
                return (
                  <List.Item key={course._id}><Link to={url}>{course.shortName}</Link></List.Item>
                );
              })}
            </List>
          ) }
        </Segment>
        <Segment>
          <Header dividing={true}>RELATED OPPORTUNITIES</Header>
          {this.props.isStudent ? (
            <Grid columns={3} stackable={true} celled={'internally'}>
              <Grid.Column textAlign='center'>
                <Header as='h4'><Icon name='checkmark' color='green'/>Completed</Header>
                <List>
                  {this.props.relatedOpportunities.completed.length === 0 ? 'None' :
                    _.map(this.props.relatedOpportunities.completed, (opportunityID) => {
                      const opportunity = Opportunities.findDoc(opportunityID);
                      const slug = Slugs.getNameFromID(opportunity.slugID);
                      const url = `${this.props.baseURL}/opportunities/${slug}`;
                      return (
                        <List.Item key={opportunity._id}><Link to={url}>{opportunity.shortName}</Link></List.Item>
                      );
                    })}
                </List>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h4'><Icon name='warning sign' color='yellow'/>In Plan (Not Yet Completed)</Header>
                <List>
                  {this.props.relatedOpportunities.inPlan.length === 0 ? 'None' :
                    _.map(this.props.relatedOpportunities.inPlan, (opportunityID) => {
                      const opportunity = Opportunities.findDoc(opportunityID);
                      const slug = Slugs.getNameFromID(opportunity.slugID);
                      const url = `${this.props.baseURL}/opportunities/${slug}`;
                      return (
                        <List.Item key={opportunity._id}><Link to={url}>{opportunity.shortName}</Link></List.Item>
                      );
                    })}
                </List>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h4'><Icon name='warning circle' color='red'/>Not In Plan</Header>
                <List>
                  {this.props.relatedOpportunities.notInPlan.length === 0 ? 'None' :
                    _.map(this.props.relatedOpportunities.notInPlan, (opportunityID) => {
                      const opportunity = Opportunities.findDoc(opportunityID);
                      const slug = Slugs.getNameFromID(opportunity.slugID);
                      const url = `${this.props.baseURL}/opportunities/${slug}`;
                      return (
                        <List.Item key={opportunity._id}><Link to={url}>{opportunity.name}</Link></List.Item>
                      );
                    })}
                </List>
              </Grid.Column>
            </Grid>
          ) : (
            <List horizontal={true} bulleted={true}>
              {_.map(this.props.relatedOpportunities.notInPlan, (opportunityID) => {
                const opportunity = Opportunities.findDoc(opportunityID);
                const slug = Slugs.getNameFromID(opportunity.slugID);
                const url = `${this.props.baseURL}/courses/${slug}`;
                return (
                  <List.Item key={opportunity._id}><Link to={url}>{opportunity.name}</Link></List.Item>
                );
              })}
            </List>
          ) }
        </Segment>
      </div>
    );
  }
}

export default InterestedRelatedWidget;
