import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { AcademicTerm, Course, Interest, Profile, ProfileCourse, Review } from '../../../../typings/radgrad';
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
import { getAssociationRelatedCourses, getAssociationRelatedOpportunities } from '../utilities/getExplorerRelatedMethods';
import RelatedCourses from '../../../components/shared/RelatedCourses';

interface CourseViewPageProps {
  profileCourses: ProfileCourse[];
  course: Course;
  itemReviews: Review[];
  profile: Profile;
  terms: AcademicTerm[];
  courses: Course[];
  interests: Interest[];
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

const CourseViewPage: React.FC<CourseViewPageProps> = ({
  profileCourses,
  course,
  itemReviews,
  profile,
  terms,
  courses,
  interests,
}) => {
  const headerPaneTitle = Courses.getName(course._id);
  const headerPaneImage =  course.picture;
  const added = ProfileCourses.findNonRetired({
    userID: profile.userID,
    courseID: course._id,
  }).length > 0;
  const relatedOpportunities = getAssociationRelatedOpportunities(Courses.findRelatedOpportunities(course._id), profile.userID);
  const relatedCareerGoals = Courses.findRelatedCareerGoals(course._id);
  const headerPaneButton = <AddToProfileButton type={PROFILE_ENTRY_TYPE.COURSE} userID={profile.userID} item={course}
    added={added} inverted floated="left" />;
  const courseSlug = Slugs.getNameFromID(course.slugID);
  const completed = isCourseCompleted(courseSlug, profile.userID);
  const relatedSlugs = Courses.getPrerequisiteSlugs(course._id);
  const relatedCourses = getAssociationRelatedCourses(relatedSlugs.map((c) => Courses.findDocBySlug(c)), profile.userID);
  const combinedArrays = relatedCourses.inPlan.concat(relatedCourses.notInPlan, relatedCourses.completed);

  return (
    <PageLayout id={PAGEIDS.COURSE} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
      headerPaneButton={headerPaneButton}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={course} />
            {combinedArrays.length !== 0 ? <RelatedCourses relatedCourses={relatedCourses} profile={profile} title='prerequisites' /> : null}
            <RelatedCareerGoals careerGoals={relatedCareerGoals} userID={profile.userID} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerCourse course={course} profile={profile} completed={completed} itemReviews={itemReviews}
              terms={terms} courses={courses} interests={interests} />
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
  const allTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const after = currentTermNumber - 8;
  const before = currentTermNumber + 16;
  const terms = allTerms.filter((t) => t.termNumber >= after && t.termNumber <= before);
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  return {
    course: courseDoc,
    profileCourses,
    itemReviews,
    profile,
    terms,
    courses,
    interests,
  };
})(CourseViewPage);
