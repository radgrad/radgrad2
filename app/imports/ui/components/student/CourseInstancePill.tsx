import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ICourseInstance } from '../../../typings/radgrad';
import { getItemStyle } from './StyleFunctions';

interface ICourseInstancePillProps {
  instance: ICourseInstance;
  index: number;
  handleClickCourseInstance: (event, { value }) => any;
}

class CourseInstancePill extends React.Component<ICourseInstancePillProps> {
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
    return (
      <Draggable key={this.props.instance._id} draggableId={this.props.instance._id} index={this.props.index}>
        {(prov, snap) => (
          <div
            ref={prov.innerRef}
            {...prov.draggableProps}
            {...prov.dragHandleProps}
            style={getItemStyle(
              snap.isDragging,
              prov.draggableProps.style,
            )}
          >
            <Grid.Row onClick={this.handleClick}>
              <b>{this.props.instance.note}</b>
            </Grid.Row>

          </div>
        )}
      </Draggable>
    );
  }
}

export default CourseInstancePill;
