import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { AcademicTerm, Course, Interest, Internship, Profile, ProfileCourse, Review, Teaser } from '../../../../typings/radgrad';
import { Courses } from '../../../../api/course/CourseCollection';
import { ProfileCourses } from '../../../../api/user/profile-entries/ProfileCourseCollection';
import { Users } from '../../../../api/user/UserCollection';
import ExplorerCourse from '../../../components/shared/explorer/item-view/course/ExplorerCourse';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import RelatedCareerGoals from '../../../components/shared/RelatedCareerGoals';
import RelatedOpportunities from '../../../components/shared/RelatedOpportunities';
import PageLayout from '../../PageLayout';
import { getAssociationRelatedOpportunities } from '../utilities/getExplorerRelatedMethods';
import RelatedInternships from '../../../components/shared/RelatedInternships';
import { Internships } from '../../../../api/internship/InternshipCollection';

interface CourseViewPageProps {
  profileCourses: ProfileCourse[];
  course: Course;
  itemReviews: Review[];
  profile: Profile;
  terms: AcademicTerm[];
  courses: Course[];
  interests: Interest[];
  review: Review[];
  teaser: Teaser[];
}

const isCourseCompleted = (courseSlugName, userID): boolean => {
  let courseCompleted = false;
  const theCourse = Courses.findDocBySlug(courseSlugName);
  const ci = CourseInstances.findNonRetired({
    studentID: userID,
    courseID: theCourse._id,
  });
  ci.forEach((c) => {
    if (c.verified === true) {
      courseCompleted = true;
    }
  });
  return courseCompleted;
};

const getRelatedInternships = (course: Course) => {
  const internships = Internships.find().fetch();
  return internships.filter((internship: Internship) => internship.interestIDs.filter(x => course.interestIDs.includes(x)).length > 0);
};

const CourseViewPage: React.FC<CourseViewPageProps> = ({
  profileCourses,
  course,
  itemReviews,
  profile,
  terms,
  courses,
  interests,
  review,
  teaser,
}) => {
  const headerPaneTitle = Courses.getName(course._id);
  const headerPaneImage =  course.picture;
  const added = ProfileCourses.findNonRetired({
    userID: profile.userID,
    courseID: course._id,
  }).length > 0;
  const relatedOpportunities = getAssociationRelatedOpportunities(Courses.findRelatedOpportunities(course._id), profile.userID);
  const relatedCareerGoals = Courses.findRelatedCareerGoals(course._id);
  const relatedInternships = getRelatedInternships(course);
  const headerPaneButton = <AddToProfileButton type={PROFILE_ENTRY_TYPE.COURSE} userID={profile.userID} item={course}
    added={added} inverted floated="left" />;
  const courseSlug = Slugs.getNameFromID(course.slugID);
  const completed = isCourseCompleted(courseSlug, profile.userID);

  return (
    <PageLayout id={PAGEIDS.COURSE} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
      headerPaneButton={headerPaneButton}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={course} />
            <RelatedCareerGoals careerGoals={relatedCareerGoals} userID={profile.userID} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
            <RelatedInternships internships={relatedInternships} userID={profile.userID} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerCourse course={course} profile={profile} completed={completed} itemReviews={itemReviews}
              terms={terms} courses={courses} interests={interests} review={review} teaser={teaser} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { course, username } = useParams();
  const courseDoc = Courses.findDocBySlug(course);
  const profile = Users.getProfile(username);
  const profileCourses = ProfileCourses.findNonRetired({ userID: profile.userID });
  const itemReviews = Reviews.findNonRetired({ revieweeID: courseDoc._id, visible: true });
  const review = Reviews.findNonRetired({ revieweeID: courseDoc._id, visible: true, studentID: profile.userID });
  const allTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const after = currentTermNumber - 8;
  const before = currentTermNumber + 16;
  const terms = allTerms.filter((t) => t.termNumber >= after && t.termNumber <= before);
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const teaser = Teasers.findNonRetired({ targetSlugID: courseDoc.slugID });
  return {
    course: courseDoc,
    profileCourses,
    itemReviews,
    profile,
    terms,
    courses,
    interests,
    review,
    teaser,
  };
})(CourseViewPage);
