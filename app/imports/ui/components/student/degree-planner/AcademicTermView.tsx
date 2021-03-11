import React from 'react';
import _ from 'lodash';
import { Header, Segment, Icon } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { AcademicTerm, CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import DraggableCourseInstancePill from './DraggableCourseInstancePill';
import DraggableOpportunityInstancePill from './DraggableOpportunityInstancePill';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { getDroppableListStyle } from './utilities/styles';

interface AcademicTermViewProps {
  term: AcademicTerm;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const AcademicTermView: React.FC<AcademicTermViewProps> = ({
  term,
  studentID,
  handleClickCourseInstance,
  handleClickOpportunityInstance,
  courseInstances,
  opportunityInstances,
}) => {
  const termSlug = Slugs.getNameFromID(term.slugID);
  const paddedStyle = {
    margin: 10,
    padding: 5,
  };
  const headerStyle = {
    marginBottom: 0,
  };
  const currentTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const inPast = term.termNumber < currentTermNum;
  const isCurrent = term.termNumber === currentTermNum;
  const courseInstancesToShow = _.filter(courseInstances, (ci) => ci.termID === term._id);
  const opportunityInstancesToShow = _.filter(opportunityInstances, (oi) => oi.termID === term._id);
  return (
    <Segment style={paddedStyle}>
      <Header disabled={inPast} color={isCurrent ? 'green' : 'black'} style={headerStyle}>
        {AcademicTerms.toString(term._id)}
      </Header>
      <Droppable droppableId={`${termSlug}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getDroppableListStyle(snapshot.isDraggingOver)}>
            {_.map(courseInstancesToShow, (ci, index) => (
              <DraggableCourseInstancePill key={ci._id} instance={ci} index={index} inPast={inPast}
                                           handleClickCourseInstance={handleClickCourseInstance} />
            ))}
            {_.map(opportunityInstancesToShow, (oi, index) => (
              <DraggableOpportunityInstancePill key={oi._id} instance={oi}
                                                index={courseInstancesToShow.length + index}
                                                handleClickOpportunityInstance={handleClickOpportunityInstance} />
            ))}
            {provided.placeholder}
            <Icon name="plus circle" color="grey" /> Drag Here
          </div>
        )}
      </Droppable>
    </Segment>
  );
};

export default AcademicTermView;
