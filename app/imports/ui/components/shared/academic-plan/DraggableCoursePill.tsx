import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggablePillStyle } from './utilities/styles';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';
// import PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import CoursePill from './CoursePill';

interface CoursePillProps {
  draggableId: string;
  choice: string;
  index: number;
  studentID: string;
  satisfied: boolean;
}

const DraggableCoursePill: React.FC<CoursePillProps> = ({ draggableId, choice, index, studentID, satisfied }) => (
  <Draggable key={choice} draggableId={draggableId} index={index}>
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
        <CoursePill name={PlanChoices.toString(choice)} />

      </div>
    )}
  </Draggable>
);

export default DraggableCoursePill;
