import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Grid, Icon, Popup } from 'semantic-ui-react';
import { OpportunityInstance } from '../../../../typings/radgrad';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { getDraggablePillStyle } from './utilities/styles';
import NamePill from './NamePill';
import IceHeader from '../../shared/IceHeader';
import RemoveIt from './RemoveIt';

interface OpportunityInstancePillProps {
  instance: OpportunityInstance;
  index: number;
  handleClickOpportunityInstance: (event, { value }) => any;
}

const handleClick = (instance, handleClickOpportunityInstance) => (event) => {
  event.preventDefault();
  // console.log(`clicked OI ${props.instance}`);
  handleClickOpportunityInstance(event, { value: instance._id });
};

const shortenName = (name: string): string => {
  // console.log(name, name.length);
  if (name.length > 20) {
    return `${name.substring(0, 17)}...`;
  }
  return name;
};

const DraggableOpportunityInstancePill: React.FC<OpportunityInstancePillProps> = ({ instance, index, handleClickOpportunityInstance }) => {
  const opp = Opportunities.findDoc(instance.opportunityID);
  return (
    <Popup
      trigger={
        <div>
          <Draggable key={instance._id} draggableId={instance._id} index={index}>
            {(prov, snap) => (
              <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggablePillStyle(snap.isDragging, prov.draggableProps.style)}>
                <Grid>
                  {instance.verified ?
                    <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Grid.Column width={16} onClick={handleClick(instance, handleClickOpportunityInstance)}>
                        <NamePill name={shortenName(opp.name)} />
                      </Grid.Column>
                    </Grid.Row>
                    :
                    <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Grid.Column width={13} onClick={handleClick(instance, handleClickOpportunityInstance)}>
                        <NamePill name={shortenName(opp.name)} />
                      </Grid.Column>
                      <Grid.Column width={3} verticalAlign='middle'>
                        <RemoveIt collectionName="OpportunityInstanceCollection" id={instance._id} name={opp.name} courseNumber="" />
                      </Grid.Column>
                    </Grid.Row>
                  }
                </Grid>
              </div>
            )}
          </Draggable>
        </div>
      }
    >
      <Popup.Content>
        {instance.verified ? <Icon color="green" size="large" name="check circle outline" /> : <Icon color="red" size="large" name="question circle outline" />}
        <IceHeader ice={opp.ice} />
      </Popup.Content>
    </Popup>
  );
};

export default DraggableOpportunityInstancePill;
