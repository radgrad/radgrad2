import React from 'react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import { ROLE } from '../../../../../../api/role/Role';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import { AcademicTerm, Course, Interest, Profile, Review } from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import EditCourseButton from '../../../manage/course/EditCourseButton';
import DeleteItemButton from '../../../manage/DeleteItemButton';
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
}

const review = (course: Course, profile: Profile): Review => {
  const reviews = Reviews.findNonRetired({
    studentID: profile.userID,
    revieweeID: course._id,
  });
  if (reviews.length > 0) {
    return reviews[0];
  }
  return null;
};

const teaserUrlHelper = (course: Course): string => {
  const courseTeaser = Teasers.findNonRetired({ targetSlugID: course.slugID });
  if (courseTeaser.length > 1) { // TODO do we need this?
    return undefined;
  }
  return courseTeaser && courseTeaser[0] && courseTeaser[0].url;
};

const ExplorerCourse: React.FC<ExplorerCoursesWidgetProps> = ({ course, courses, completed, itemReviews, profile, terms, interests }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const compactRowStyle = { paddingTop: 2, paddingBottom: 2 };
  const linkStyle = {  textDecoration: 'underline' };
  const match = useRouteMatch();
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: course.slugID }).length > 0;
  const isStudent = profile.role === ROLE.STUDENT;
  const isAdmin = profile.role === ROLE.ADMIN;
  return (
    <div id="explorerCourseWidget">
      <Segment padded className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaserUrlHelper(course)} /> : ''}
        <Grid stackable style={fiveMarginTopStyle}>
          <Grid.Row style={compactRowStyle}>
            <strong>Credit Hours:</strong>&nbsp; {course.creditHrs}
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong>Syllabus:</strong>&nbsp; {course.syllabus ? <a href={course.syllabus } target="_blank" rel="noreferrer" style={linkStyle}>{course.syllabus}</a> : 'N/A'}
          </Grid.Row>
          <Grid.Row>
            <Markdown allowDangerousHtml source={course.description} />
          </Grid.Row>
          {isStudent ? '' : <EditCourseButton course={course} courses={courses} interests={interests} />}
          {isAdmin ? <DeleteItemButton item={course} type={PROFILE_ENTRY_TYPE.COURSE} /> : ''}
        </Grid>
      </Segment>

      <Segment textAlign="center">
        <Header>STUDENTS PARTICIPATING BY SEMESTER</Header>
        <Divider />
        <FutureParticipation item={course} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={course} userReview={review(course, match)} completed={completed} reviewType="course" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <Segment><ExplorerReviewWidget itemReviews={itemReviews} reviewType="course" /></Segment>
      )}
    </div>
  );
};

export default ExplorerCourse;
