import React from 'react';
import { useRouteMatch } from 'react-router';
import { Grid, Header } from 'semantic-ui-react';
import { Courses } from '../../../../app/imports/api/course/CourseCollection';
import { Slugs } from '../../../../app/imports/api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../../app/imports/ui/layouts/utilities/route-constants';
import { ButtonLink } from '../../../../app/imports/ui/components/shared/button/ButtonLink';
import IceHeader from '../../../../app/imports/ui/components/shared/IceHeader';
import * as RouterUtils from '../../../../app/imports/ui/components/shared/utilities/router';

interface StudentRecommendedCourseItemProps {
  courseID: string;
}

const StudentRecommendedCourseItem: React.FC<StudentRecommendedCourseItemProps> = ({ courseID }) => {
  const course = Courses.findDoc(courseID);
  const courseICE = { i: 0, c: 10, e: 0 };
  const slug = Slugs.getNameFromID(course.slugID);
  const match = useRouteMatch();
  return (
    <Grid.Row columns='two'>
      <Grid.Column floated='left'>
        <Header>{course.name} <IceHeader ice={courseICE} /></Header>
      </Grid.Column>
      <Grid.Column floated='right' textAlign='right'>
        <ButtonLink url={RouterUtils.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug}`)} label='See details / Add to profile' icon='search plus' size='small'/>
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentRecommendedCourseItem;
