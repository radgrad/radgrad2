import React from 'react';
import { Grid, Popup } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { ICourseInstance } from '../../../typings/radgrad';
import { getDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import { Courses } from '../../../api/course/CourseCollection';

interface ICourseInstancePillProps {
  instance: ICourseInstance;
  index: number;
  handleClickCourseInstance: (event, { value }) => any;
}

const getName = (courseInstance) => {
  const course = Courses.findDoc(courseInstance.courseID);
  return course.name;
};

const handleClick = (props: ICourseInstancePillProps) => (event) => {
  event.preventDefault();
  props.handleClickCourseInstance(event, { value: props.instance._id });
};

const DraggableCourseInstancePill = (props: ICourseInstancePillProps) => (
  <Popup
    trigger={(
      <div>
        <Draggable key={props.instance._id} draggableId={props.instance._id} index={props.index}>
          {(prov, snap) => (
            <div
              ref={prov.innerRef}
              {...prov.draggableProps}
              {...prov.dragHandleProps}
              style={getDraggablePillStyle(
              snap.isDragging,
              prov.draggableProps.style,
            )}
            >
              <Grid.Row onClick={handleClick(props)}>
                <NamePill name={props.instance.note} />
              </Grid.Row>

            </div>
        )}
        </Draggable>
      </div>
  )}
    content={getName(props.instance)}
  />
);

export default DraggableCourseInstancePill;
