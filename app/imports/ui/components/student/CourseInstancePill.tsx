import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Button, Label, Grid } from 'semantic-ui-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ICourseInstance } from '../../../typings/radgrad';

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
          >
            <Grid.Row onClick={this.handleClick}>
              {/*<Label basic={true} color="green" >*/}
                {this.props.instance.note}
              {/*</Label>*/}
            </Grid.Row>

          </div>
        )}
      </Draggable>
    );
  }
}

export default CourseInstancePill;
