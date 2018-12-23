import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Container, Grid, Header } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { IAcademicTerm, ICourseInstance, IOpportunityInstance } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import CourseInstancePill from './CourseInstancePill';
import OpportunityInstancePill from './OpportunityInstancePill';

interface IAcademicTermViewProps {
  term: IAcademicTerm;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
}

interface IAcademicTermViewState {
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}

class AcademicTermView extends React.Component<IAcademicTermViewProps, IAcademicTermViewState> {
  constructor(props) {
    super(props);
    this.state = {
      courseInstances: [],
      opportunityInstances: [],
    };
  }

  public render() {
    const termName = AcademicTerms.toString(this.props.term._id, true);
    const courseInstances = CourseInstances.find({
      termID: this.props.term._id,
      studentID: this.props.studentID,
    }).fetch();
    const opportunityInstances = OpportunityInstances.find({
      termID: this.props.term._id,
      studentID: this.props.studentID,
    }).fetch();
    return (
      <Container>
        <Header>{AcademicTerms.toString(this.props.term._id)}</Header>
        <Droppable droppableId={`${termName}-cis`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
            >

              {_.map(courseInstances, (ci) => <CourseInstancePill key={ci._id} instance={ci}
                                                                  handleClickCourseInstance={this.props.handleClickCourseInstance}/>)}
              {provided.placeholder}
            </div>)
          }
        </Droppable>
        {_.map(opportunityInstances, (oi) => <OpportunityInstancePill key={oi._id} instance={oi}
                                                                      handleClickOpportunityInstance={this.props.handleClickOpportunityInstance}/>)}
      </Container>
    );
  }

}

export default AcademicTermView;
