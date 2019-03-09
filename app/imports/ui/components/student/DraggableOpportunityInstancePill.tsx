import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Grid, Icon, Popup } from 'semantic-ui-react';
import { IOpportunityInstance } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { getDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import IceHeader from '../shared/IceHeader';

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
      <Popup trigger={
        <div>
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
        </div>}>
        <Popup.Content>
          {this.props.instance.verified ? <Icon color="green" size="large" name="check circle outline"/> :
            <Icon color="red" size="large" name="question circle outline"/>}
          <IceHeader ice={opp.ice}/>
        </Popup.Content>
      </Popup>
    );
  }
}

export default DraggableOpportunityInstancePill;
