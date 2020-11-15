import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Grid, Icon, Popup } from 'semantic-ui-react';
import { IOpportunityInstance } from '../../../../typings/radgrad';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { getDraggablePillStyle } from '../../shared/academic-plan/StyleFunctions';
import NamePill from '../../shared/academic-plan/NamePill';
import IceHeader from '../../shared/IceHeader';
import RemoveItWidget from '../../shared/academic-plan/RemoveItWidget';

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
    <Popup trigger={(
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
              <Grid>
                <Grid.Row>
                  <Grid.Column width={11} onClick={handleClick(props)}>
                    <NamePill name={opp.name} />
                  </Grid.Column>
                  <Grid.Column width={1}>
                    {props.instance.verified ? '' :
                      (
                        <RemoveItWidget
                          collectionName="OpportunityInstanceCollection"
                          id={props.instance._id}
                          name={opp.name}
                          courseNumber=""
                        />
                      )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          )}
        </Draggable>
      </div>
    )}
    >
      <Popup.Content>
        {props.instance.verified ?
          <Icon color="green" size="large" name="check circle outline" /> :
          <Icon color="red" size="large" name="question circle outline" />}
        <IceHeader ice={opp.ice} />
      </Popup.Content>
    </Popup>
  );
};

export default DraggableOpportunityInstancePill;
