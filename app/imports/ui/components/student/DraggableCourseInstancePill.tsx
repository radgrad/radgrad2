import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { ICourseInstance } from '../../../typings/radgrad';
import { getDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';

interface ICourseInstancePillProps {
  instance: ICourseInstance;
  index: number;
  handleClickCourseInstance: (event, { value }) => any;
}

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
    return (
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
    );
  }
}

export default DraggableCourseInstancePill;
