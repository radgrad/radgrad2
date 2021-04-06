import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance, UserInteractionDefine, VerificationRequestDefine } from '../../../../typings/radgrad';
import { ButtonAction } from '../../shared/button/ButtonAction';
import AcademicTermLabel from '../../shared/label/AcademicTermLabel';
import { opportunityIdToName } from '../../shared/utilities/data-model';
import { getUsername } from '../../shared/utilities/router';
import RequestVerificationPopup from './RequestVerificationPopup';

interface StudentUnverifiedOpportunityItemProps {
  opportunityInstance: OpportunityInstance;
}


const StudentUnverifiedOpportunityItem: React.FC<StudentUnverifiedOpportunityItemProps> = ({ opportunityInstance }) => {
  const term = AcademicTerms.findDoc(opportunityInstance.termID);
  const slug = Slugs.getNameFromID(term.slugID);
  const name = AcademicTerms.toString(opportunityInstance.termID, false);
  const opportunityName = opportunityIdToName(opportunityInstance.opportunityID);
  return (
    <Grid.Row columns='three'>
      <Grid.Column>
        <AcademicTermLabel slug={slug} name={name} />
      </Grid.Column>
      <Grid.Column floated='left'>
        <Header>{opportunityName}</Header>
      </Grid.Column>
      <Grid.Column>
        <RequestVerificationPopup opportunityInstance={opportunityInstance} />
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentUnverifiedOpportunityItem;
