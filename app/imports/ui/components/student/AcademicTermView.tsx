import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Container, Header } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourseInstance, IOpportunityInstance } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import CourseInstancePill from './CourseInstancePill';
import OpportunityInstancePill from './OpportunityInstancePill';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IAcademicTermViewProps {
  term: IAcademicTerm;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}

class AcademicTermView extends React.Component<IAcademicTermViewProps> {
  constructor(props) {
    super(props);
    // console.log(props);
  }

  public render() {
    const termSlug = Slugs.getNameFromID(this.props.term.slugID);
    return (
      <Container>
        <Header>{AcademicTerms.toString(this.props.term._id)}</Header>
        <Droppable droppableId={`${termSlug}`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
            >

              {_.map(this.props.courseInstances, (ci) => <CourseInstancePill key={ci._id} instance={ci}
                                                                             handleClickCourseInstance={this.props.handleClickCourseInstance}/>)}
              {provided.placeholder}
              {_.map(this.props.opportunityInstances, (oi) => <OpportunityInstancePill key={oi._id} instance={oi}
                                                                                       handleClickOpportunityInstance={this.props.handleClickOpportunityInstance}/>)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Container>
    );
  }
}

const AcademicTermViewContainer = withTracker((props) => {
  const courseInstances = CourseInstances.find({
    termID: props.term._id,
    studentID: props.studentID,
  }).fetch();
  const opportunityInstances = OpportunityInstances.find({
    termID: props.term._id,
    studentID: props.studentID,
  }).fetch();
  return {
    courseInstances,
    opportunityInstances,
    ...props,
  };
})(AcademicTermView);
export default AcademicTermViewContainer;
