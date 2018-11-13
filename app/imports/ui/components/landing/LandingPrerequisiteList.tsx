import * as React from 'react';
import { Card, Grid, Header, Icon, Image, Label, List, Loader, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { getSlugFromEntityID } from './helper-functions';

interface IPrerequisitesListProps {
  prerequisites: string[];
}

const LandingPrerequisiteList = (props: IPrerequisitesListProps) => {
  const courses = _.map(props.prerequisites, (slug) => Courses.findDocBySlug(slug));
  return (
    <List horizontal={true} bulleted={true}>
      {courses.map((course) => {
        // console.log(course.name);
        return (<List.Item key={course._id} href={`#/explorer/courses/${getSlugFromEntityID(course._id)}`}>{course.name}</List.Item>);
      })}
    </List>
  );
};

export default LandingPrerequisiteList;
