import React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradAlert from '../../utilities/RadGradAlert';
import DegreeExperiencePlanner from '../../components/student/degree-planner/DegreeExperiencePlanner';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import {
  AcademicYearInstance,
  Course,
  CourseInstance,
  CourseInstanceDefine,
  CourseInstanceUpdate,
  Opportunity,
  OpportunityInstance,
  OpportunityInstanceDefine,
  OpportunityInstanceUpdate,
  VerificationRequest,
} from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import TabbedProfileEntries from '../../components/student/degree-planner/TabbedProfileEntries';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { getUsername, MatchProps } from '../../components/shared/utilities/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { ProfileOpportunities } from '../../../api/user/profile-entries/ProfileOpportunityCollection';
import { ProfileCourses } from '../../../api/user/profile-entries/ProfileCourseCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { passedCourse, courseInstanceIsRepeatable } from '../../../api/course/CourseUtilities';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

interface StudentDegreePlannerProps {
  match: MatchProps;
  academicYearInstances: AcademicYearInstance[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  profileOpportunities: Opportunity[];
  studentID: string;
  profileCourses: Course[];
  verificationRequests: VerificationRequest[];
}

const onDragEnd = (onDragEndProps) => (result) => {
  const { match } = onDragEndProps;
  if (!result.destination) {
    return;
  }
  const termSlug: string = result.destination.droppableId;
  // Make sure we are dropping in an academic term
  if (Slugs.isDefined(termSlug)) {
    const slug: string = result.draggableId;
    const student = getUsername(match);
    const isCourseDrop = Courses.isDefined(slug);
    const isCourseInstanceDrop = CourseInstances.isDefined(slug);
    const isOppDrop = Opportunities.isDefined(slug);
    const isOppInstDrop = OpportunityInstances.isDefined(slug);
    // const isIntDrop = Internships.isDefined(slug);
    // const isIntInstDrop = InternshipInstances.isDefine(slug);
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const dropTermDoc = AcademicTerms.findDocBySlug(termSlug);
    const isPastDrop = dropTermDoc.termNumber < currentTerm.termNumber;

    if (isCourseDrop) {
      if (isPastDrop) {
        RadGradAlert.failure('Cannot drop courses in the past.', 'You cannot drag courses to a past academic term.');
      } else {
        const courseID = Courses.findIdBySlug(slug);
        const course = Courses.findDoc(courseID);
        const collectionName = CourseInstances.getCollectionName();
        const definitionData: CourseInstanceDefine = {
          academicTerm: termSlug,
          course: slug,
          verified: false,
          fromRegistrar: false,
          note: course.num,
          grade: 'B',
          student,
          creditHrs: course.creditHrs,
        };

        /**
         * If you drag a course into an academic term in which an course instance already exists for that course in
         * that academic term, that dragged course won't be added to that academic term permanently.
         * This is because although the define method fires, it won't actually insert a new course instance to the
         * database (see the define() method of CourseInstanceCollection) because it's considered a duplicate.
         * However, since the Meteor define method still fires, we want to handle that case where we drag a duplicate
         * course instance and only create a user interaction if it was not a duplicate.
         */
        // Before we define a course instance, check if it already exists first
        defineMethod
          .callPromise({ collectionName, definitionData })
          .catch((error) => {
            console.error(error);
          });
      }
    } else if (isCourseInstanceDrop) {
      if (isPastDrop) {
        RadGradAlert.failure('Cannot drop courses in the past.', 'You cannot drag courses to a past academic term.');
      } else {
        const instance = CourseInstances.findDoc(slug);
        const ciTerm = AcademicTerms.findDoc(instance.termID);
        const inPastStart = ciTerm.termNumber < currentTerm.termNumber;
        if (inPastStart) {
          RadGradAlert.failure('Cannot drop courses in the past.', 'You cannot drag courses to a past academic term.');
        } else {
          const termID = AcademicTerms.findIdBySlug(termSlug);
          const updateData: CourseInstanceUpdate = {};
          updateData.termID = termID;
          updateData.id = slug;
          const collectionName = CourseInstances.getCollectionName();
          updateMethod
            .callPromise({ collectionName, updateData })
            .catch((error) => console.error(error));
        }
      }
    } else if (isOppDrop) {
      const opportunityID = Opportunities.findIdBySlug(slug);
      const opportunity = Opportunities.findDoc(opportunityID);
      const sponsor = Users.getProfile(opportunity.sponsorID).username;
      const collectionName = OpportunityInstances.getCollectionName();
      const definitionData: OpportunityInstanceDefine = { academicTerm: termSlug, opportunity: slug, verified: false, student, sponsor };
      /**
       * If you drag an opportunity into an academic term in which an opportunity instance already exists for that opportunity
       * in that academic term, that dragged opportunity won't be added to that academic term permanently.
       * This is because although the define method fires, it won't actually insert a new opportunity instance to the
       * database (see the define() method of OpportunityInstanceCollection) because it's considered a duplicate.
       * However, since the Meteor define method still fires, we want to handle that case where we drag a duplicate
       * opportunity instance and only create a user interaction if it was not a duplicate.
       */
      defineMethod
        .callPromise({ collectionName, definitionData })
        .catch((error) => console.error(error));
    } else if (isOppInstDrop) {
      const termID = AcademicTerms.findIdBySlug(termSlug);
      const updateData: OpportunityInstanceUpdate = {};
      updateData.termID = termID;
      updateData.id = slug;
      const collectionName = OpportunityInstances.getCollectionName();
      updateMethod
        .callPromise({ collectionName, updateData })
        .catch((error) => console.error(error));
    }
  }
};

const headerPaneTitle = 'Plan your courses and opportunities';
const headerPaneBody = `
Use this degree planner to map out your courses and opportunities each semester.
  * Opportunities will earn you **Innovation** and **Experience** points.
  * Courses will earn you **Competency** points.

Telling RadGrad what you've planned and completed helps the system provide better recommendations and supports community building.
`;
const headerPaneImage = 'images/header-panel/header-planner.png';

const StudentDegreePlannerPage: React.FC<StudentDegreePlannerProps> = ({ academicYearInstances, studentID, match, profileCourses, profileOpportunities, courseInstances, opportunityInstances, verificationRequests }) => {

  const onDragEndProps = { match };
  const paddedStyle = { paddingTop: 0, paddingLeft: 10, paddingRight: 20 };
  return (
    <DragDropContext onDragEnd={onDragEnd(onDragEndProps)}>
      <PageLayout id={PAGEIDS.STUDENT_DEGREE_PLANNER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
        <Grid stackable>
          <Grid.Row stretched>
            <Grid.Column width={11} style={paddedStyle}>
              <DegreeExperiencePlanner academicYearInstances={academicYearInstances} courseInstances={courseInstances} opportunityInstances={opportunityInstances} verificationRequests={verificationRequests} />
            </Grid.Column>

            <Grid.Column width={5} style={paddedStyle}>
              <TabbedProfileEntries
                profileOpportunities={profileOpportunities}
                studentID={studentID}
                profileCourses={profileCourses}
                courseInstances={courseInstances}
                opportunityInstances={opportunityInstances}
                verificationRequests={verificationRequests}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </PageLayout>
    </DragDropContext>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  const pOpportunities = ProfileOpportunities.findNonRetired({ userID: studentID });
  let profileOpportunities = pOpportunities.map((f) => Opportunities.findDoc(f.opportunityID));
  // first filter the retired opportunities
  profileOpportunities = profileOpportunities.filter((opp) => !opp.retired);
  // next filter opportunities w/o future academic terms
  // profileOpportunities = profileOpportunities.filter((opp) => {
  //   const terms = opp.termIDs.map((term) => AcademicTerms.findDoc(term));
  //   return terms.some((term) => AcademicTerms.isUpcomingTerm(term._id));
  // });
  const courseInstances = CourseInstances.findNonRetired({ studentID });
  const pCourses = ProfileCourses.findNonRetired({ userID: studentID });
  let profileCourses = pCourses.map((f) => Courses.findDoc(f.courseID));
  // first get rid of any retired courses
  profileCourses = profileCourses.filter((course) => !course.retired);
  // next filter out the passed classes, but not if they are repeatable.
  profileCourses = profileCourses.filter((course) => {
    const ci = courseInstances.find((instance) => instance.courseID === course._id);
    if (ci) {
      // console.log(!passedCourse(ci), courseInstanceIsRepeatable(ci), ci.note);
      return !passedCourse(ci) || courseInstanceIsRepeatable(ci);
    }
    return true; // no course instance so it is from profileCourses.
  });
  const academicYearInstances: AcademicYearInstance[] = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
  const opportunityInstances = OpportunityInstances.findNonRetired({ studentID });
  const verificationRequests = VerificationRequests.findNonRetired({ studentID });
  return {
    academicYearInstances,
    opportunityInstances,
    courseInstances,
    profileOpportunities,
    studentID,
    profileCourses,
    verificationRequests,
  };
})(StudentDegreePlannerPage);
