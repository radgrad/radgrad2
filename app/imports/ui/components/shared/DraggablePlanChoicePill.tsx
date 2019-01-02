import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { getDraggablePillStyle } from './StyleFunctions';
import NamePill from './NamePill';
import { PlanChoiceCollection } from '../../../api/degree-plan/PlanChoiceCollection';

interface IPlanChoicePillProps {
  choice: string;
  index: number;
  studentID: string;
}

class DraggablePlanChoicePill extends React.Component<IPlanChoicePillProps> {
  constructor(props) {
    // console.log(props.instance);
    super(props);
  }

  public render() {
    return (
      <Draggable key={this.props.choice} draggableId={this.props.choice} index={this.props.index}>
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
            <Grid.Row>
              <NamePill name={PlanChoiceCollection.toStringFromSlug(this.props.choice)}/>
            </Grid.Row>

          </div>
        )}
      </Draggable>
    );
  }
}

export default DraggablePlanChoicePill;
