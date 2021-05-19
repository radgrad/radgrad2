import React from 'react';
import { Grid, Header, Icon, Label } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { OpportunityInstance } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';
import AcademicTermLabel from '../../shared/label/AcademicTermLabel';
import { opportunityIdToName } from '../../shared/utilities/data-model';

interface StudentVerifiedOpportunityItemProps {
  opportunityInstance: OpportunityInstance;
}

const StudentVerifiedOpportunityItem: React.FC<StudentVerifiedOpportunityItemProps> = ({ opportunityInstance }) => {
  const term = AcademicTerms.findDoc(opportunityInstance.termID);
  const slug = Slugs.getNameFromID(term.slugID);
  const name = AcademicTerms.toString(opportunityInstance.termID, false);
  const opportunityName = opportunityIdToName(opportunityInstance.opportunityID);
  const vr = VerificationRequests.findNonRetired({
    studentID: opportunityInstance.studentID,
    opportunityInstanceID: opportunityInstance._id,
    status: VerificationRequests.ACCEPTED,
  });
  const date = vr.length > 0 ? vr[0].submittedOn.toDateString() : '';
  return (
    <Grid.Row columns='three'>
      <Grid.Column>
        <AcademicTermLabel slug={slug} name={name} />
      </Grid.Column>
      <Grid.Column floated='left'>
        <Header>{opportunityName} <IceHeader ice={opportunityInstance.ice} size='small' /></Header>
      </Grid.Column>
      <Grid.Column textAlign='right'>
        <Label color='green' size='large'><Icon className='check circle' /> {date}</Label>
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentVerifiedOpportunityItem;
