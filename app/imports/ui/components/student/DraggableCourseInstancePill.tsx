import * as React from 'react';
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

class DraggableCourseInstancePill extends React.Component<ICourseInstancePillProps> {
  constructor(props) {
    // console.log(props.instance);
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(event) {
    event.preventDefault();
    this.props.handleClickCourseInstance(event, { value: this.props.instance._id });
  }

  public render() {
    // console.log('DraggableCourseInstancePill ci=%o', this.props.instance.note);
    return (
      <Popup trigger={
        <div>
          <Draggable key={this.props.instance._id} draggableId={this.props.instance._id} index={this.props.index}>
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
                <Grid.Row onClick={this.handleClick}>
                  <NamePill name={this.props.instance.note}/>
                </Grid.Row>

              </div>
            )}
          </Draggable>
        </div>} content={getName(this.props.instance)}/>
    );
  }
}

export default DraggableCourseInstancePill;
