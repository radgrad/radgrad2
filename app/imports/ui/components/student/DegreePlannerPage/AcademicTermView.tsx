import React from 'react';
import _ from 'lodash';
import { Container, Header, Grid } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourseInstance, IOpportunityInstance } from '../../../../typings/radgrad';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import DraggableCourseInstancePill from './DraggableCourseInstancePill';
import DraggableOpportunityInstancePill from './DraggableOpportunityInstancePill';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { getDroppableListStyle } from '../../shared/StyleFunctions';

interface IAcademicTermViewProps {
  term: IAcademicTerm;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}

const AcademicTermView = (props: IAcademicTermViewProps) => {
  const termSlug = Slugs.getNameFromID(props.term.slugID);
  const paddedStyle = {
    margin: 10,
    padding: 5,
  };
  const currentTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const inPast = props.term.termNumber < currentTermNum;
  const isCurrent = props.term.termNumber === currentTermNum;
  return (
    <Container style={paddedStyle}>
      <Header
        dividing
        disabled={inPast}
        color={isCurrent ? 'green' : 'black'}
      >
        {AcademicTerms.toString(props.term._id)}
      </Header>
      <Grid stackable stretched>
        <Droppable droppableId={`${termSlug}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getDroppableListStyle(snapshot.isDraggingOver)}
            >
              {_.map(props.courseInstances, (ci, index) => (
                <DraggableCourseInstancePill
                  key={ci._id}
                  instance={ci}
                  index={index}
                  inPast={inPast}
                  handleClickCourseInstance={props.handleClickCourseInstance}
                />
              ))}
              {_.map(props.opportunityInstances, (oi, index) => (
                <DraggableOpportunityInstancePill
                  key={oi._id}
                  instance={oi}
                  index={props.courseInstances.length + index}
                  handleClickOpportunityInstance={props.handleClickOpportunityInstance}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Grid>
    </Container>
  );
};

const AcademicTermViewContainer = withTracker((props) => {
  const courseInstances = CourseInstances.findNonRetired({
    termID: props.term._id,
    studentID: props.studentID,
  });
  const opportunityInstances = OpportunityInstances.findNonRetired({
    termID: props.term._id,
    studentID: props.studentID,
  });
  return {
    courseInstances,
    opportunityInstances,
    ...props,
  };
})(AcademicTermView);
export default AcademicTermViewContainer;
