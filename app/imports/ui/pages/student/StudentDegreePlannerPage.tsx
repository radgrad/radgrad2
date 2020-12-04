import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import DegreeExperiencePlannerWidget from '../../components/student/degree-planner/DegreeExperiencePlannerWidget';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import {
  IAcademicTerm,
  ICourseInstance,
  ICourseInstanceDefine,
  ICourseInstanceUpdate, IMeteorError, IOpportunityInstance,
  IOpportunityInstanceDefine,
  IOpportunityInstanceUpdate, IUserInteractionDefine,
} from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import TabbedFavoritesWidget from '../../components/student/degree-planner/TabbedFavoritesWidget';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { getUsername, IMatchProps } from '../../components/shared/utilities/router';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import GuidedTourDegreePlanner from '../../components/student/degree-planner/GuidedTourDegreePlanner';

interface IStudentDegreePlannerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  selectCourseInstance: (courseInstanceID: string) => any;
  // eslint-disable-next-line react/no-unused-prop-types
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  // eslint-disable-next-line react/no-unused-prop-types
  selectFavoriteDetailsTab: () => any;
  // eslint-disable-next-line react/no-unused-prop-types
  match: IMatchProps;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

const onDragEnd = (props: IStudentDegreePlannerProps) => (result) => {
  if (!result.destination) {
    return;
  }
  const termSlug: string = result.destination.droppableId;
  const slug: string = result.draggableId;
  const student = getUsername(props.match);
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
  const academicTerm: IAcademicTerm = AcademicTerms.getAcademicTermFromToString(academicTermToString);
  let interactionData: IUserInteractionDefine;

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
      const definitionData: ICourseInstanceDefine = {
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
      const instanceExists: ICourseInstance = CourseInstances.findCourseInstanceDoc(termID, courseID, student);
      defineMethod.call({ collectionName, definitionData }, (error, res) => {
        if (error) {
          console.error(error);
        } else {
          props.selectCourseInstance(res);
          // props.selectFavoriteDetailsTab();
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
        const updateData: ICourseInstanceUpdate = {};
        updateData.termID = termID;
        updateData.id = slug;
        const collectionName = CourseInstances.getCollectionName();
        updateMethod.call({ collectionName, updateData }, (error: IMeteorError) => {
          if (error) {
            console.error(error);
          } else {
            props.selectCourseInstance(slug);
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
    const definitionData: IOpportunityInstanceDefine = {
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
    const instanceExists: IOpportunityInstance = OpportunityInstances.findOpportunityInstanceDoc(termID, opportunityID, student);
    defineMethod.call({ collectionName, definitionData }, (error, res) => {
      if (error) {
        console.error(error);
      } else {
        props.selectOpportunityInstance(res);
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
    const updateData: IOpportunityInstanceUpdate = {};
    updateData.termID = termID;
    updateData.id = slug;
    const collectionName = OpportunityInstances.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
      } else {
        props.selectOpportunityInstance(slug);
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

const StudentDegreePlannerPage = (props: IStudentDegreePlannerProps) => {
  const paddedStyle = {
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 20,
  };
  const marginStyle = {
    marginLeft: 10,
    marginRight: 10,
  };
  return (
    <DragDropContext onDragEnd={onDragEnd(props)}>
      <StudentPageMenuWidget />
      <GuidedTourDegreePlanner />
      <Container id="degree-planner-page">
        <Grid stackable style={marginStyle}>
          <Grid.Row stretched>
            <Grid.Column width={10} style={paddedStyle}>
              <DegreeExperiencePlannerWidget />
            </Grid.Column>

            <Grid.Column width={6} style={paddedStyle}>
              <TabbedFavoritesWidget />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </DragDropContext>
  );
};

const StudentDegreePlannerPageContainer = connect(null, mapDispatchToProps)(StudentDegreePlannerPage);

export default StudentDegreePlannerPageContainer;
