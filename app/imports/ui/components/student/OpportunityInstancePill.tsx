import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Grid, Header, Label } from 'semantic-ui-react';
import { IOpportunityInstance } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { getItemStyle } from './StyleFunctions';

interface IOpportunityInstancePillProps {
  instance: IOpportunityInstance;
  index: number;
  handleClickOpportunityInstance: (event, { value }) => any;
}

class OpportunityInstancePill extends React.Component<IOpportunityInstancePillProps> {
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
            style={getItemStyle(
              snap.isDragging,
              prov.draggableProps.style,
            )}
          >
            <Grid.Row onClick={this.handleClick}>
              <b>{opp.name}</b>
            </Grid.Row>

          </div>
        )}
      </Draggable>
    );
  }
}

export default OpportunityInstancePill;
