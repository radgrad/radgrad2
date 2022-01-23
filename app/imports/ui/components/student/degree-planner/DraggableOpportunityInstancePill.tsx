import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Grid, Modal } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../../api/user/UserCollection';
import { OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { EXPLORER_TYPE, STUDENT_VERIFICATION, URL_ROLES } from '../../../layouts/utilities/route-constants';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { ButtonAction } from '../../shared/button/ButtonAction';
import { ButtonLink } from '../../shared/button/ButtonLink';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import FutureParticipationButton from '../../shared/FutureParticipationButton';
import { cardStyle, DraggableColors, getDraggableOpportunityPillStyle } from './utilities/styles';
import NamePill from './NamePill';
import IceHeader from '../../shared/IceHeader';
import RemoveIt from './RemoveIt';

interface OpportunityInstancePillProps {
  instance: OpportunityInstance;
  index: number;
  verificationRequests: VerificationRequest[];
}

const shortenName = (name: string): string => {
  // console.log(name, name.length);
  if (name.length > 20) {
    return `${name.substring(0, 17)}...`;
  }
  return name;
};

const DraggableOpportunityInstancePill: React.FC<OpportunityInstancePillProps> = ({ instance, index, verificationRequests }) => {
  const opp = Opportunities.findDoc(instance.opportunityID);
  const profile = Users.getProfile(instance.studentID);
  const [open, setOpen] = useState(false);
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const opportunityTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = opportunityTerm.termNumber >= currentTerm.termNumber;
  const termName = AcademicTerms.getShortName(instance.termID);
  const verificationRequestsToShow = verificationRequests.filter((vr) => vr.opportunityInstanceID === instance._id);
  const verificationRequested = verificationRequestsToShow.length > 0;
  const handleRemove = () => {
    const collectionName = OpportunityInstances.getCollectionName();
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        RadGradAlert.success('Remove succeeded');
      })
      .catch((error) => console.error(`Remove opportunity instance ${instance} failed.`, error));
  };
  const match = useRouteMatch();
  const color = DraggableColors.OPPORTUNITY;
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <div>
          <Draggable key={instance._id} draggableId={instance._id} index={index}>
            {(prov, snap) => (
              <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggableOpportunityPillStyle(snap.isDragging, prov.draggableProps.style)}>
                <Grid>
                  {instance.verified ?
                    <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Grid.Column width={16}>
                        <NamePill name={shortenName(opp.name)} color={color} icon='lightbulb' />
                      </Grid.Column>
                    </Grid.Row>
                    :
                    <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Grid.Column width={13}>
                        <NamePill name={shortenName(opp.name)} color={color} icon='lightbulb'  />
                      </Grid.Column>
                      <Grid.Column width={3} verticalAlign='middle'>
                        <RemoveIt collectionName='OpportunityInstanceCollection' id={instance._id} name={opp.name} courseNumber='' />
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
      <Modal.Header>
        {opp.name} <IceHeader ice={instance.ice} />
      </Modal.Header>
      <Modal.Content>
        {futureP ? (
          <React.Fragment>
            <p>
              <b>Scheduled:</b> {termName}
            </p>
            <FutureParticipationButton item={opp} />
            <ButtonAction onClick={handleRemove} icon='trash alternate outline' label='Remove' style={cardStyle} size='mini' id='remove-opportunity' />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p>
              <b>Participated:</b> {termName}
            </p>
            {verificationRequested ? (
              ''
            ) : (
              <React.Fragment>
                <ButtonLink url={`/${URL_ROLES.STUDENT}/${profile.username}/${STUDENT_VERIFICATION}`} label='Verification Page' size='mini' />
                <ButtonAction onClick={handleRemove} icon='trash alternate outline' label='Remove' style={cardStyle} size='mini' id='remove-verification' />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.OPPORTUNITIES} item={opp} size='mini' />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DraggableOpportunityInstancePill;
