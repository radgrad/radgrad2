import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggablePillStyle } from './StyleFunctions';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';
import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import CoursePill from './CoursePill';

interface ICoursePillProps {
  choice: string;
  index: number;
  studentID: string;
  satisfied: boolean;
}

class DraggableCoursePill extends React.Component<ICoursePillProps> {
  constructor(props) {
    // console.log(props.instance);
    super(props);
  }

  public render() {
    const draggableId = PlanChoiceUtils.stripCounter(this.props.choice);
    return (
      <Draggable key={this.props.choice} draggableId={draggableId} index={this.props.index}>
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
              <CoursePill name={PlanChoiceCollection.toStringFromSlug(this.props.choice)}/>

          </div>
        )}
      </Draggable>
    );
  }
}

export default DraggableCoursePill;
