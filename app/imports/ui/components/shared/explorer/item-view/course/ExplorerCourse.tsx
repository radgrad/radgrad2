import React from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import { ROLE } from '../../../../../../api/role/Role';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import { StudentProfiles } from '../../../../../../api/user/StudentProfileCollection';
import { AcademicTerm, Course, Interest, Profile, Review } from '../../../../../../typings/radgrad';
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
}

const review = (course: Course, profile): Review => {
  const user = StudentProfiles.findByUsername(profile);
  const reviews = Reviews.findNonRetired({ studentID: user.userID, revieweeID: course._id });
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
  const gridStyle = { marginTop: '5px', paddingLeft: 16 };
  const compactRowStyle = { paddingTop: 2, paddingBottom: 2 };
  const linkStyle = {  textDecoration: 'underline' };
  const { username } = useParams();
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: course.slugID }).length > 0;
  const isStudent = profile.role === ROLE.STUDENT;
  const isAdmin = profile.role === ROLE.ADMIN;
  return (
    <div id="explorerCourseWidget">
      <Segment className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaserUrlHelper(course)} /> : ''}
        <Grid stackable style={gridStyle}>
          <Grid.Row style={compactRowStyle}>
            <strong>Credit Hours:</strong>&nbsp; {course.creditHrs}
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong>Syllabus:</strong>&nbsp; {course.syllabus ? <a href={course.syllabus } target="_blank" rel="noreferrer" style={linkStyle}>{course.syllabus}</a> : 'N/A'}
          </Grid.Row>
          <Grid.Row>
            <Markdown allowDangerousHtml linkTarget="_blank" source={course.description} />
          </Grid.Row>
          {isStudent ? '' : <EditCourseButton course={course} courses={courses} interests={interests} />}
          {isAdmin ? <DeleteItemButton item={course} type={PROFILE_ENTRY_TYPE.COURSE} /> : ''}
        </Grid>
      </Segment>

      <Segment>
        <RadGradHeader title='STUDENTS PARTICIPATING BY SEMESTER' />
        <FutureParticipation item={course} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={course} userReview={review(course, username)} completed={completed} reviewType="course" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <Segment><ExplorerReviewWidget itemReviews={itemReviews} reviewType="course" /></Segment>
      )}
    </div>
  );
};

export default ExplorerCourse;
