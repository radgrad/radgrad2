import React from 'react';
import { Grid, Popup } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { CourseInstance } from '../../../../typings/radgrad';
import { getDraggablePillStyle } from './utilities/styles';
import NamePill from './NamePill';
import { Courses } from '../../../../api/course/CourseCollection';
import RemoveIt from './RemoveIt';

interface CourseInstancePillProps {
  instance: CourseInstance;
  index: number;
  inPast: boolean;
  handleClickCourseInstance: (event, { value }) => any;
}

const getName = (courseInstance) => {
  const course = Courses.findDoc(courseInstance.courseID);
  return course.name;
};

const handleClick = (instance, handleClickCourseInstance) => (event) => {
  event.preventDefault();
  handleClickCourseInstance(event, { value: instance._id });
};

const DraggableCourseInstancePill: React.FC<CourseInstancePillProps> = ({ instance, index, inPast, handleClickCourseInstance }) => (
  <Popup
    trigger={
      <div>
        <Draggable key={instance._id} draggableId={instance._id} index={index}>
          {(prov, snap) => (
            <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggablePillStyle(snap.isDragging, prov.draggableProps.style)}>
              <Grid>
                {inPast ?
                  <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                    <Grid.Column width={16} onClick={handleClick(instance, handleClickCourseInstance)}>
                      <NamePill name={instance.note} />
                    </Grid.Column>
                  </Grid.Row> :
                  <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                    <Grid.Column width={13} onClick={handleClick(instance, handleClickCourseInstance)}>
                      <NamePill name={instance.note} />
                    </Grid.Column>
                    <Grid.Column width={3} verticalAlign='middle' textAlign='left'>
                      <RemoveIt collectionName="CourseInstanceCollection" id={instance._id} name={getName(instance)} courseNumber={instance.note} />
                    </Grid.Column>
                  </Grid.Row>
                }
              </Grid>
            </div>
          )}
        </Draggable>
      </div>
    }
    content={getName(instance)}
  />
);

export default DraggableCourseInstancePill;
