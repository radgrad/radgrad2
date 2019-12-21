import * as React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import DegreeExperiencePlannerWidget from '../../components/student/DegreeExperiencePlannerWidget';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

import { ICourseInstanceDefine, IOpportunityInstanceDefine, IRadGradMatch } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import TabbedFavoritesWidget from '../../components/student/TabbedFavoritesWidget';

interface IPageProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  match: IRadGradMatch;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
});

const onDragEnd = (props: IPageProps) => (result) => {
  // console.log(result);
  if (!result.destination) {
    return;
  }
  const termSlug: string = result.destination.droppableId;
  const slug: string = result.draggableId;
  const student = props.match.params.username;
  // console.log(termSlug, slug, student);
  if (Courses.isDefined(slug)) {
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
        // console.log(res);
        props.selectCourseInstance(res);
      }
    });
  } else if (Opportunities.isDefined(slug)) {
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
    // console.log(definitionData);
    defineMethod.call({ collectionName, definitionData }, (error, res) => {
      if (error) {
        console.error(error);
      } else {
        // console.log(res);
        props.selectOpportunityInstance(res);
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
    marginTop: 5,
  };
  return (
    <DragDropContext onDragEnd={onDragEnd(props)}>
      <StudentPageMenuWidget/>
      <Grid stackable={true} style={marginStyle}>
        <Grid.Row>
          <HelpPanelWidget/>
        </Grid.Row>

        <Grid.Row verticalAlign="middle" style={{ paddingBottom: 0 }}>
          <Header as="h1" style={{ paddingLeft: 10 }}>Degree Experience Planner</Header>
        </Grid.Row>
        <Grid.Row stretched={true}>
          <Grid.Column width={10} style={paddedStyle}>
            <DegreeExperiencePlannerWidget/>
          </Grid.Column>

          <Grid.Column width={6} style={paddedStyle}>
            <TabbedFavoritesWidget/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </DragDropContext>
  );
};

const StudentDegreePlannerPageContainer = connect(null, mapDispatchToProps)(StudentDegreePlannerPage);

export default withRouter(StudentDegreePlannerPageContainer);
