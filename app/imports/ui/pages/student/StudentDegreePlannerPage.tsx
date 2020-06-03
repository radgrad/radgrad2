import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import DegreeExperiencePlannerWidget from '../../components/student/DegreeExperiencePlannerWidget';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import {
  ICourseInstanceDefine,
  ICourseInstanceUpdate, IMeteorError,
  IOpportunityInstanceDefine,
  IOpportunityInstanceUpdate,
} from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import TabbedFavoritesWidget from '../../components/student/TabbedFavoritesWidget';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IPageProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  selectFavoriteDetailsTab: () => any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

const onDragEnd = (props: IPageProps) => (result) => {
  // console.log(result);
  if (!result.destination) {
    return;
  }
  const termSlug: string = result.destination.droppableId;
  const slug: string = result.draggableId;
  const student = props.match.params.username;
  const isCourseDrop = Courses.isDefined(slug);
  const isCourseInstanceDrop = CourseInstances.isDefined(slug);
  const isOppDrop = Opportunities.isDefined(slug);
  const isOppInstDrop = OpportunityInstances.isDefined(slug);
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const dropTermDoc = AcademicTerms.findDocBySlug(termSlug);
  const isPastDrop = dropTermDoc.termNumber < currentTerm.termNumber;
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
      defineMethod.call({ collectionName, definitionData }, (error, res) => {
        if (error) {
          console.error(error);
        } else {
          props.selectCourseInstance(res);
          // props.selectFavoriteDetailsTab();
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
    defineMethod.call({ collectionName, definitionData }, (error, res) => {
      if (error) {
        console.error(error);
      } else {
        props.selectOpportunityInstance(res);
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
      }
    });

  }
};


const StudentDegreePlannerPage = (props: IPageProps) => {
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
      <Grid stackable style={marginStyle}>
        <Grid.Row>
          <HelpPanelWidget />
        </Grid.Row>

        <Grid.Row verticalAlign="middle" style={{ paddingBottom: 0 }}>
          <Header as="h1" style={{ paddingLeft: 10 }}>Degree Experience Planner</Header>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={10} style={paddedStyle}>
            <DegreeExperiencePlannerWidget />
          </Grid.Column>

          <Grid.Column width={6} style={paddedStyle}>
            <TabbedFavoritesWidget />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </DragDropContext>
  );
};

const StudentDegreePlannerPageContainer = connect(null, mapDispatchToProps)(StudentDegreePlannerPage);

export default withRouter(StudentDegreePlannerPageContainer);
