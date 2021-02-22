import React from 'react';
import { Grid } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import DegreeExperiencePlannerWidget from '../../components/student/degree-planner/DegreeExperiencePlannerWidget';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import {
  AcademicTerm,
  AcademicYearInstance,
  Course,
  CourseInstance,
  CourseInstanceDefine,
  CourseInstanceUpdate,
  MeteorError,
  Opportunity,
  OpportunityInstance,
  OpportunityInstanceDefine,
  OpportunityInstanceUpdate,
  UserInteractionDefine,
  VerificationRequest,
} from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { SelectPayload, SelectTab } from '../../../redux/student/degree-planner/actions';
import TabbedFavoritesWidget from '../../components/student/degree-planner/TabbedFavoritesWidget';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { getUsername, MatchProps } from '../../components/shared/utilities/router';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { Slugs } from '../../../api/slug/SlugCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { passedCourse } from '../../../api/course/CourseUtilities';
import PageLayout from '../PageLayout';

interface StudentDegreePlannerProps {
  takenSlugs: string[];
  selectCourseInstance: (courseInstanceID: string) => SelectPayload;
  selectOpportunityInstance: (opportunityInstanceID: string) => SelectPayload;
  selectFavoriteDetailsTab: () => SelectTab;
  match: MatchProps;
  academicYearInstances: AcademicYearInstance[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  opportunities: Opportunity[];
  studentID: string;
  courses: Course[];
  verificationRequests: VerificationRequest[];
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

const onDragEnd = (onDragEndProps) => (result) => {
  const { match, selectCourseInstance, selectOpportunityInstance } = onDragEndProps;
  if (!result.destination) {
    return;
  }
  const termSlug: string = result.destination.droppableId;
  const slug: string = result.draggableId;
  const student = getUsername(match);
  const isCourseDrop = Courses.isDefined(slug);
  const isCourseInstanceDrop = CourseInstances.isDefined(slug);
  const isOppDrop = Opportunities.isDefined(slug);
  const isOppInstDrop = OpportunityInstances.isDefined(slug);
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const dropTermDoc = AcademicTerms.findDocBySlug(termSlug);
  const isPastDrop = dropTermDoc.termNumber < currentTerm.termNumber;

  // Variables for dealing with defining user interaction
  const academicTermSplit = result.destination.droppableId.split('-'); // droppableID is in the form "Term-Year"
  const academicTermToString = academicTermSplit.join(' '); // AcademicTerms.getAcademicTermFromToString splits based on whitespace
  const academicTerm: AcademicTerm = AcademicTerms.getAcademicTermFromToString(academicTermToString);
  let interactionData: UserInteractionDefine;

  if (isCourseDrop) {
    if (isPastDrop) {
      Swal.fire({
        title: 'Cannot drop courses in the past.',
        text: 'You cannot drag courses to a past academic term.',
        icon: 'error',
      });
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
      const termID = academicTerm._id;
      const instanceExists: CourseInstance = CourseInstances.findCourseInstanceDoc(termID, courseID, student);
      defineMethod.call({ collectionName, definitionData }, (error, res) => {
        if (error) {
          console.error(error);
        } else {
          selectCourseInstance(res);
          if (!instanceExists) {
            interactionData = {
              username: student,
              type: UserInteractionsTypes.ADDCOURSE,
              typeData: [academicTermSplit[0], academicTermSplit[1], slug],
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
              if (userInteractionError) {
                console.error('Error creating UserInteraction.', userInteractionError);
              }
            });
          }
        }
      });
    }
  } else if (isCourseInstanceDrop) {
    if (isPastDrop) {
      Swal.fire({
        title: 'Cannot move a course to the past.',
        text: 'You cannot drag courses to a past academic term.',
        icon: 'error',
      });
    } else {
      const instance = CourseInstances.findDoc(slug);
      const ciTerm = AcademicTerms.findDoc(instance.termID);
      const inPastStart = ciTerm.termNumber < currentTerm.termNumber;
      if (inPastStart) {
        Swal.fire({
          title: 'Cannot move a course from the past.',
          text: 'You cannot drag courses from a past academic term.',
          icon: 'error',
        });
      } else {
        const termID = AcademicTerms.findIdBySlug(termSlug);
        const updateData: CourseInstanceUpdate = {};
        updateData.termID = termID;
        updateData.id = slug;
        const collectionName = CourseInstances.getCollectionName();
        updateMethod.call({ collectionName, updateData }, (error: MeteorError) => {
          if (error) {
            console.error(error);
          } else {
            selectCourseInstance(slug);
            interactionData = {
              username: student,
              type: UserInteractionsTypes.UPDATECOURSE,
              typeData: [academicTermSplit[0], academicTermSplit[1], CourseInstances.getCourseSlug(slug)],
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
              if (userInteractionError) {
                console.error('Error creating UserInteraction.', userInteractionError);
              }
            });
          }
        });
      }
    }
  } else if (isOppDrop) {
    const opportunityID = Opportunities.findIdBySlug(slug);
    const opportunity = Opportunities.findDoc(opportunityID);
    const sponsor = Users.getProfile(opportunity.sponsorID).username;
    const collectionName = OpportunityInstances.getCollectionName();
    const definitionData: OpportunityInstanceDefine = {
      academicTerm: termSlug,
      opportunity: slug,
      verified: false,
      student,
      sponsor,
    };
    /**
     * If you drag an opportunity into an academic term in which an opportunity instance already exists for that opportunity
     * in that academic term, that dragged opportunity won't be added to that academic term permanently.
     * This is because although the define method fires, it won't actually insert a new opportunity instance to the
     * database (see the define() method of OpportunityInstanceCollection) because it's considered a duplicate.
     * However, since the Meteor define method still fires, we want to handle that case where we drag a duplicate
     * opportunity instance and only create a user interaction if it was not a duplicate.
     */
    const termID = academicTerm._id;
    const instanceExists: OpportunityInstance = OpportunityInstances.findOpportunityInstanceDoc(termID, opportunityID, student);
    defineMethod.call({ collectionName, definitionData }, (error, res) => {
      if (error) {
        console.error(error);
      } else {
        selectOpportunityInstance(res);
        if (!instanceExists) {
          interactionData = {
            username: student,
            type: UserInteractionsTypes.ADDOPPORTUNITY,
            typeData: [academicTermSplit[0], academicTermSplit[1], slug],
          };
          userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
            if (userInteractionError) {
              console.error('Error creating UserInteraction.', userInteractionError);
            }
          });
        }
      }
    });
  } else if (isOppInstDrop) {
    const termID = AcademicTerms.findIdBySlug(termSlug);
    const updateData: OpportunityInstanceUpdate = {};
    updateData.termID = termID;
    updateData.id = slug;
    const collectionName = OpportunityInstances.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
      } else {
        selectOpportunityInstance(slug);
        interactionData = {
          username: student,
          type: UserInteractionsTypes.UPDATEOPPORTUNITY,
          typeData: [academicTermSplit[0], academicTermSplit[1], OpportunityInstances.getOpportunitySlug(slug)],
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.error('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    });
  }
};

const headerPaneTitle = 'Plan your courses and opportunities';
const headerPaneBody = `
Use this degree planner to map out your courses and opportunities each semester.
  * Opportunities will earn you **Innovation** and **Experience** points.
  * Courses will earn you **Competency** points.

Telling RadGrad what you've planned and completed helps the system provide better recommendations and supports community building.
`;
const headerPaneImage = 'header-planner.png';

const StudentDegreePlannerPage: React.FC<StudentDegreePlannerProps> = ({
  academicYearInstances,
  studentID,
  match,
  courses,
  opportunities,
  courseInstances,
  opportunityInstances,
  selectCourseInstance,
  selectFavoriteDetailsTab,
  selectOpportunityInstance,
  takenSlugs,
  verificationRequests,
}) => {
  const onDragEndProps = { match, selectCourseInstance, selectOpportunityInstance };
  const paddedStyle = {
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 20,
  };
  return (
    <DragDropContext onDragEnd={onDragEnd(onDragEndProps)}>
      <PageLayout id="degree-planner-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid stackable>
          <Grid.Row stretched>
            <Grid.Column width={10} style={paddedStyle}>
              <DegreeExperiencePlannerWidget academicYearInstances={academicYearInstances} courseInstances={courseInstances} opportunityInstances={opportunityInstances} />
            </Grid.Column>

            <Grid.Column width={6} style={paddedStyle}>
              <TabbedFavoritesWidget
                takenSlugs={takenSlugs}
                opportunities={opportunities}
                studentID={studentID}
                courses={courses}
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

const takenSlugs = (courseInstances: CourseInstance[]): string[] => {
  const passedCourseInstances = _.filter(courseInstances, (ci) => passedCourse(ci));
  return _.map(passedCourseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
};

const StudentDegreePlannerPageContainer = connect(null, mapDispatchToProps)(StudentDegreePlannerPage);

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  const favoriteOpportunities = FavoriteOpportunities.findNonRetired({ studentID });
  const opportunities = _.map(favoriteOpportunities, (f) => Opportunities.findDoc(f.opportunityID));
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const courses = _.map(favoriteCourses, (f) => Courses.findDoc(f.courseID));
  const academicYearInstances: AcademicYearInstance[] = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
  const courseInstances = CourseInstances.findNonRetired({ studentID: profile.userID });
  const opportunityInstances = OpportunityInstances.findNonRetired({ studentID: profile.userID });
  const verificationRequests = VerificationRequests.findNonRetired({ studentID });
  return {
    takenSlugs: takenSlugs(courseInstances),
    academicYearInstances,
    opportunityInstances,
    courseInstances,
    opportunities,
    studentID,
    courses,
    verificationRequests,
  };
})(StudentDegreePlannerPageContainer);
