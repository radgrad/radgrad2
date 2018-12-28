import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Container, Header, Grid } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourseInstance, IOpportunityInstance } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import DraggableCourseInstancePill from './DraggableCourseInstancePill';
import DraggableOpportunityInstancePill from './DraggableOpportunityInstancePill';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getDroppableListStyle } from '../shared/StyleFunctions';

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
    const paddedStyle = {
      margin: 10,
      padding: 5,
    };
    return (
      <Container style={paddedStyle}>
        <Header dividing={true}>{AcademicTerms.toString(this.props.term._id)}</Header>
        <Grid stackable={true} stretched={true}>
          <Droppable droppableId={`${termSlug}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={style}
                style={getDroppableListStyle(snapshot.isDraggingOver)}
              >
                {_.map(this.props.courseInstances, (ci, index) => <DraggableCourseInstancePill key={ci._id} instance={ci} index={index}
                                                                                               handleClickCourseInstance={this.props.handleClickCourseInstance}/>)}
                {_.map(this.props.opportunityInstances, (oi, index) => <DraggableOpportunityInstancePill key={oi._id} instance={oi} index={index}
                                                                                                         handleClickOpportunityInstance={this.props.handleClickOpportunityInstance}/>)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Grid>
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
