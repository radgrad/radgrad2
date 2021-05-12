import React, { useEffect, useState } from 'react';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Markdown from 'react-markdown';
import { AcademicTerms } from '../../../../../../api/academic-term/AcademicTermCollection';
import { getFutureEnrollmentSingleMethod } from '../../../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../../../startup/both/RadGradForecasts';
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
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: course._id, type: ENROLLMENT_TYPE.COURSE })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, course._id]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }
  return (
    <div id="explorerCourseWidget">
      <Segment padded className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaserUrlHelper(course)} /> : ''}
          <Grid stackable style={fiveMarginTopStyle}>
            <Grid.Row style={compactRowStyle}>
              <strong>Credit Hours:</strong>&nbsp; {course.num}
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
                <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={course} userReview={review(course, match)} completed={completed} reviewType="opportunity" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <Segment><ExplorerReviewWidget itemReviews={itemReviews} reviewType="course" /></Segment>
      )}
    </div>
  );
};

export default ExplorerCourse;
