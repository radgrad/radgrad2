import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggablePillStyle } from './StyleFunctions';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';
// import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import CoursePill from './CoursePill';

interface ICoursePillProps {
  draggableId: string;
  choice: string;
  index: number;
  studentID: string;
  satisfied: boolean;
}

const DraggableCoursePill = (props: ICoursePillProps) => (
  <Draggable key={props.choice} draggableId={props.draggableId} index={props.index}>
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
        <CoursePill name={PlanChoiceCollection.toStringFromSlug(props.choice)} />

      </div>
    )}
  </Draggable>
);

export default DraggableCoursePill;
