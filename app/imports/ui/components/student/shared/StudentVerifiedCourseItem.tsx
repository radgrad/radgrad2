import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CourseInstance } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';
import AcademicTermLabel from '../../shared/label/AcademicTermLabel';
import { courseIdToName } from '../../shared/utilities/data-model';

interface StudentVerifiedCourseItemProps {
  courseInstance: CourseInstance;
}

const StudentVerifiedCourseItem: React.FC<StudentVerifiedCourseItemProps> = ({ courseInstance }) => {
  const term = AcademicTerms.findDoc(courseInstance.termID);
  const slug = Slugs.getNameFromID(term.slugID);
  const name = AcademicTerms.toString(courseInstance.termID, false);
  const courseName = courseIdToName(courseInstance.courseID);
  return (
    <Grid.Row columns='two'>
      <Grid.Column>
        <AcademicTermLabel slug={slug} name={name} />
      </Grid.Column>
      <Grid.Column floated='left'>
        <Header>{courseName} <IceHeader ice={courseInstance.ice} /></Header>
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentVerifiedCourseItem;
