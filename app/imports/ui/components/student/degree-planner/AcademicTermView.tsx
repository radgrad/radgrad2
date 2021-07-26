import React from 'react';
import { Header, Segment, Icon } from 'semantic-ui-react';
import { Droppable } from 'react-beautiful-dnd';
import { AcademicTerm, CourseInstance, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import DraggableCourseInstancePill from './DraggableCourseInstancePill';
import DraggableOpportunityInstancePill from './DraggableOpportunityInstancePill';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { getDroppableListStyle } from './utilities/styles';

interface AcademicTermViewProps {
  term: AcademicTerm;
  studentID: string;
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
  // internshipInstances: InternshipInstance[];
}

const AcademicTermView: React.FC<AcademicTermViewProps> = ({
  term,
  studentID,
  courseInstances,
  opportunityInstances,
  verificationRequests,
  /* internshipInstances, */
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
  const courseInstancesToShow = courseInstances.filter((ci) => ci.termID === term._id);
  const opportunityInstancesToShow = opportunityInstances.filter((oi) => oi.termID === term._id);
  return (
    <Droppable droppableId={`${termSlug}`}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} style={getDroppableListStyle(snapshot.isDraggingOver)}>
          <Segment style={paddedStyle}>
            <Header disabled={inPast} color={isCurrent ? 'green' : 'black'} style={headerStyle}>
              {AcademicTerms.toString(term._id)}
            </Header>
            {courseInstancesToShow.map((ci, index) => (
              <DraggableCourseInstancePill key={ci._id} instance={ci} index={index} inPast={inPast} />
            ))}
            {opportunityInstancesToShow.map((oi, index) => (
              <DraggableOpportunityInstancePill key={oi._id} instance={oi} index={courseInstancesToShow.length + index} verificationRequests={verificationRequests} />
            ))}
            {provided.placeholder}
            <Icon name="plus circle" color="grey" /> Drag Here
          </Segment>
        </div>
      )}
    </Droppable>
  );
};

export default AcademicTermView;
