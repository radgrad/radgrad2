import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggablePillStyle, getNonStudentStyle, getNotSatisfiedStyle, getSatisfiedStyle } from './StyleFunctions';
import NamePill from './NamePill';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';
import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';

interface IPlanChoicePillProps {
  choice: string;
  index: number;
  studentID: string;
  satisfied: boolean;
  isStatic: boolean; // For the `/explorer/plans` page (Academic Plans), which is static (no drag and drop)
  role: string;
}

class DraggablePlanChoicePill extends React.Component<IPlanChoicePillProps> {
  constructor(props) {
    // console.log(props.instance);
    super(props);
  }

  public render() {
    const style = this.props.satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
    const isRoleStudent = this.props.role === 'student';
    const draggableId = PlanChoiceUtils.stripCounter(this.props.choice);
    return (
      <Draggable key={this.props.choice} draggableId={draggableId} index={this.props.index}
                 isDragDisabled={!!this.props.isStatic}>
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
            <Grid.Row style={isRoleStudent ? style : getNonStudentStyle()}>
              <NamePill name={PlanChoiceCollection.toStringFromSlug(this.props.choice)}/>
            </Grid.Row>

          </div>
        )}
      </Draggable>
    );
  }
}

export default DraggablePlanChoicePill;
