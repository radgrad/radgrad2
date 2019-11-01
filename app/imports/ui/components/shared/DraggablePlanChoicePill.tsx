import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggablePillStyle, getNotSatisfiedStyle, getSatisfiedStyle } from './StyleFunctions';
import NamePill from './NamePill';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';
import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';

interface IPlanChoicePillProps {
  choice: string;
  index: number;
  studentID: string;
  satisfied: boolean;
}

const DraggablePlanChoicePill = (props: IPlanChoicePillProps) => {
  const style = props.satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
  const draggableId = PlanChoiceUtils.stripCounter(props.choice);
  return (
    <Draggable key={props.choice} draggableId={draggableId} index={props.index}>
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
          <Grid.Row style={style}>
            <NamePill name={PlanChoiceCollection.toStringFromSlug(props.choice)}/>
          </Grid.Row>

        </div>
      )}
    </Draggable>
  );
};

export default DraggablePlanChoicePill;
