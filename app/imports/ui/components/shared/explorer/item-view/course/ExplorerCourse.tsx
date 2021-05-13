import React from 'react';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import { AcademicTerm, Course, Profile, Review } from '../../../../../../typings/radgrad';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import ExplorerReviewWidget from '../ExplorerReviewWidget';
import FutureParticipation from '../../FutureParticipation';
import TeaserVideo from '../../../TeaserVideo';
import { ROLE } from '../../../../../../api/role/Role';
import { Reviews } from '../../../../../../api/review/ReviewCollection';

interface ExplorerCoursesWidgetProps {
  course: Course;
  completed: boolean;
  itemReviews: Review[];
  profile: Profile;
  terms: AcademicTerm[];
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

const ExplorerCourse: React.FC<ExplorerCoursesWidgetProps> = ({ course, completed, itemReviews, profile, terms }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const compactRowStyle = { paddingTop: 2, paddingBottom: 2 };
  const linkStyle = {  textDecoration: 'underline' };
  const match = useRouteMatch();
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: course.slugID }).length > 0;
  const isStudent = profile.role === ROLE.STUDENT;
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
