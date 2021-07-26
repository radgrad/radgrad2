import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { Course, CourseInstance } from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import FutureParticipationButton from '../../shared/FutureParticipationButton';
import NamePill from './NamePill';
import { buttonStyle, DraggableColors, getDraggableCoursePillStyle } from './utilities/styles';

interface ProfileCourseAccordionProps {
  course: Course;
  studentID: string;
  courseInstances: CourseInstance[];
}

const ProfileCourseAccordion: React.FC<ProfileCourseAccordionProps> = ({ course, courseInstances, studentID }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const match = useRouteMatch();
  const instances = courseInstances.filter((i) => i.courseID === course._id);
  const terms = instances.map((i) => AcademicTerms.findDoc(i.termID));
  // Sort by ascending order
  terms.sort((a, b) => a.year - b.year);
  const termNames = terms.map((t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(course.slugID).name;
  const droppableID = `${course._id}`;
  const courseName = Courses.getName(course._id);
  const color = DraggableColors.COURSE;
  return (
    <Accordion fluid styled>
      <Accordion.Title active={active} onClick={handleClick}>
        {courseName}
        <Icon name="dropdown" />
      </Accordion.Title>
      <Accordion.Content active={active}>
        {instances.length > 0 ? (
          <React.Fragment>
            <b>Scheduled:</b> {termNames}
          </React.Fragment>
        ) : (
          <b>Not In Plan (Drag to move)</b>
        )}
        <Droppable droppableId={droppableID}>
          {(provided) => (
            <div ref={provided.innerRef}>
              <Draggable key={slug} draggableId={slug} index={0}>
                {(prov, snap) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggableCoursePillStyle(snap.isDragging, prov.draggableProps.style)}>
                    <NamePill name={course.num} color={color} />
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <FutureParticipationButton item={course} style={buttonStyle} />
        <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.COURSES} item={course} size="mini" style={buttonStyle} />
      </Accordion.Content>
    </Accordion>
  );
};

export default ProfileCourseAccordion;
