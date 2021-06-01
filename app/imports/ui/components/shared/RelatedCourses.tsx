import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import { Profile, RelatedCoursesOrOpportunities } from '../../../typings/radgrad';
import CourseList from './CourseList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';
import { Courses } from '../../../api/course/CourseCollection';
import { ROLE } from '../../../api/role/Role';

interface RelatedCoursesProps {
  relatedCourses: RelatedCoursesOrOpportunities;
  profile: Profile;
  title?:string;
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ relatedCourses, profile, title }) => {
  const header = <RadGradHeader title= {title || 'related courses'} icon={EXPLORER_TYPE_ICON.COURSE} />;
  return (
    <RadGradSegment header={header}>
      {profile.role === ROLE.STUDENT ? (
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
    </RadGradSegment>
  );
};

export default RelatedCourses;
