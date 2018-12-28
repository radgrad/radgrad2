import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Grid, Header, Label } from 'semantic-ui-react';
import { IOpportunityInstance } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { getDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';

interface IOpportunityInstancePillProps {
  instance: IOpportunityInstance;
  index: number;
  handleClickOpportunityInstance: (event, { value }) => any;
}

class DraggableOpportunityInstancePill extends React.Component<IOpportunityInstancePillProps> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(event) {
    event.preventDefault();
    // console.log(`clicked OI ${this.props.instance}`);
    this.props.handleClickOpportunityInstance(event, { value: this.props.instance._id });
  }

  public render() {
    const opp = Opportunities.findDoc(this.props.instance.opportunityID);
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
              <NamePill name={opp.name}/>
            </Grid.Row>

          </div>
        )}
      </Draggable>
    );
  }
}

export default DraggableOpportunityInstancePill;
