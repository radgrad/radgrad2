import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Grid, Icon, Popup } from 'semantic-ui-react';
import { IOpportunityInstance } from '../../../typings/radgrad'; // eslint-disable-line
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { getDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import IceHeader from '../shared/IceHeader';

interface IOpportunityInstancePillProps {
  instance: IOpportunityInstance;
  index: number;
  handleClickOpportunityInstance: (event, { value }) => any;
}

const handleClick = (props: IOpportunityInstancePillProps) => (event) => {
  event.preventDefault();
  // console.log(`clicked OI ${props.instance}`);
  props.handleClickOpportunityInstance(event, { value: props.instance._id });
};

const DraggableOpportunityInstancePill = (props: IOpportunityInstancePillProps) => {
  const opp = Opportunities.findDoc(props.instance.opportunityID);
  return (
    <Popup trigger={
      <div>
        <Draggable key={props.instance._id} draggableId={props.instance._id} index={props.index}>
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
              <Grid.Row onClick={handleClick(props)}>
                <NamePill name={opp.name}/>
              </Grid.Row>

            </div>
          )}
        </Draggable>
      </div>}>
      <Popup.Content>
        {props.instance.verified ? <Icon color="green" size="large" name="check circle outline"/> :
          <Icon color="red" size="large" name="question circle outline"/>}
        <IceHeader ice={opp.ice}/>
      </Popup.Content>
    </Popup>
  );
};

export default DraggableOpportunityInstancePill;
