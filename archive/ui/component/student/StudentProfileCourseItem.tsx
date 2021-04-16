import React from 'react';
import { useRouteMatch } from 'react-router';
import { Grid, Header, Label } from 'semantic-ui-react';
import { Courses } from '../../../../app/imports/api/course/CourseCollection';
import { ButtonLink } from '../../../../app/imports/ui/components/shared/button/ButtonLink';
import IceHeader from '../../../../app/imports/ui/components/shared/IceHeader';
import * as RouterUtils from '../../../../app/imports/ui/components/shared/utilities/router';

interface StudentProfileCourseItemProps {
  courseID: string;
}

const StudentProfileCourseItem: React.FC<StudentProfileCourseItemProps> = ({ courseID }) => {
  const course = Courses.findDoc(courseID);
  const courseICE = { i: 0, c: 10, e: 0 };
  const match = useRouteMatch();
  return (
    <Grid.Row columns='three'>
      <Grid.Column>
        <Label color='green' size='large'>IN PROFILE</Label>
      </Grid.Column>
      <Grid.Column floated='left' textAlign='left'>
        <Header>{course.num} <IceHeader ice={courseICE} /></Header>
      </Grid.Column>
      <Grid.Column textAlign='right'>
        <ButtonLink url={RouterUtils.buildRouteName(match, '/degree-planner')} label='Add to degree plan'
                    icon='search plus' size='small' />
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentProfileCourseItem;

