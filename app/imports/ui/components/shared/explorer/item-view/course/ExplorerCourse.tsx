import React from 'react';
import Markdown from 'react-markdown';
import { Divider, Grid, Segment } from 'semantic-ui-react';
import BaseCollection from '../../../../../../api/base/BaseCollection';
import { ROLE } from '../../../../../../api/role/Role';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import { AcademicTerm, Course, Interest, Profile, Review, Teaser } from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import EditCourseButton from '../../../manage/course/EditCourseButton';
import DeleteItemButton from '../../../manage/DeleteItemButton';
import RadGradHeader from '../../../RadGradHeader';
import TeaserVideo from '../../../TeaserVideo';
import FutureParticipation from '../../FutureParticipation';
import ExplorerReviewWidget from '../ExplorerReviewWidget';

interface ExplorerCoursesWidgetProps {
  course: Course;
  completed: boolean;
  itemReviews: Review[];
  profile: Profile;
  terms: AcademicTerm[];
  courses: Course[];
  interests: Interest[];
  review: Review[];
  teaser: Teaser[];
}

const ExplorerCourse: React.FC<ExplorerCoursesWidgetProps> = ({ course, courses, completed, itemReviews, profile, terms, interests, teaser, review }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const gridStyle = { marginTop: '5px', paddingLeft: 16 };
  const compactRowStyle = { paddingTop: 2, paddingBottom: 2 };
  const linkStyle = {  textDecoration: 'underline' };
  const hasTeaser = teaser.length > 0;
  const isStudent = profile.role === ROLE.STUDENT;
  const isAdmin = profile.role === ROLE.ADMIN;
  const reviewDoc = review.length > 0 ? review[0] : null;
  return (
    <div id="explorerCourseWidget">
      <Segment className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaser[0] && teaser[0].url} /> : ''}
        <Grid stackable style={gridStyle}>
          <Grid.Row style={compactRowStyle}>
            <strong>Credit Hours:</strong>&nbsp; {course.creditHrs}
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong>Syllabus:</strong>&nbsp; {course.syllabus ? <a href={course.syllabus } target="_blank" rel="noreferrer" style={linkStyle}>{course.syllabus}</a> : 'N/A'}
          </Grid.Row>
          <Grid.Row>
            <Markdown allowDangerousHtml linkTarget="_blank" source={course.description} />
            <p><strong>Last Update:</strong> {BaseCollection.getLastUpdatedFromDoc(course)}</p>
          </Grid.Row>
          {isStudent ? '' : <EditCourseButton course={course} courses={courses} interests={interests} />}
          {isAdmin ? <DeleteItemButton item={course} type={PROFILE_ENTRY_TYPE.COURSE} /> : ''}
        </Grid>
      </Segment>

      <Segment>
        <RadGradHeader icon="users" title='STUDENTS PARTICIPATING BY SEMESTER' dividing={false} />
        <Divider />
        <FutureParticipation item={course} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={course} userReview={reviewDoc} completed={completed} reviewType="course" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <Segment><ExplorerReviewWidget itemReviews={itemReviews} reviewType="course" /></Segment>
      )}
    </div>
  );
};

export default ExplorerCourse;
