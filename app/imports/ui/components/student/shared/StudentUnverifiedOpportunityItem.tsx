import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { OpportunityInstance } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';
import AcademicTermLabel from '../../shared/label/AcademicTermLabel';
import { opportunityIdToName } from '../../shared/utilities/data-model';
import RequestVerificationPopup from '../verification-requests/RequestVerificationPopup';

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
        <Header>{opportunityName}<IceHeader ice={opportunityInstance.ice} size='small' /></Header>

      </Grid.Column>
      <Grid.Column textAlign='right'>
        <RequestVerificationPopup opportunityInstance={opportunityInstance} size='medium' />
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentUnverifiedOpportunityItem;
