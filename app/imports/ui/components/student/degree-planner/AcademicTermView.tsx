import React from 'react';
import _ from 'lodash';
import { Container, Header, Grid } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { IAcademicTerm, ICourseInstance, IOpportunityInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import DraggableCourseInstancePill from './DraggableCourseInstancePill';
import DraggableOpportunityInstancePill from './DraggableOpportunityInstancePill';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { getDroppableListStyle } from '../../shared/academic-plan/utilities/styles';

interface IAcademicTermViewProps {
  term: IAcademicTerm;
  // eslint-disable-next-line react/no-unused-prop-types
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}

const AcademicTermView: React.FC<IAcademicTermViewProps> = (props) => {
  const termSlug = Slugs.getNameFromID(props.term.slugID);
  const paddedStyle = {
    margin: 10,
    padding: 5,
  };
  const currentTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const inPast = props.term.termNumber < currentTermNum;
  const isCurrent = props.term.termNumber === currentTermNum;
  const courseInstancesToShow = _.filter(props.courseInstances, (ci) => ci.termID === props.term._id);
  const opportunityInstancesToShow = _.filter(props.opportunityInstances, (oi) => oi.termID === props.term._id);
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
              {_.map(courseInstancesToShow, (ci, index) => (
                <DraggableCourseInstancePill
                  key={ci._id}
                  instance={ci}
                  index={index}
                  inPast={inPast}
                  handleClickCourseInstance={props.handleClickCourseInstance}
                />
              ))}
              {_.map(opportunityInstancesToShow, (oi, index) => (
                <DraggableOpportunityInstancePill
                  key={oi._id}
                  instance={oi}
                  index={courseInstancesToShow.length + index}
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

export default AcademicTermView;
