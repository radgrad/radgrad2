import React from 'react';
import { Grid } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { OpportunityInstance } from '../../../../typings/radgrad';
import AcademicTermLabel from '../../shared/label/AcademicTermLabel';
import { opportunityIdToName } from '../../shared/utilities/data-model';

interface StudentUnverifiedOpportunityItemProps {
  opportunityInstance: OpportunityInstance;
}

const StudentUnverifiedOpportunityItem: React.FC<StudentUnverifiedOpportunityItemProps> = ({ opportunityInstance }) => {
  const term = AcademicTerms.findDoc(opportunityInstance.termID);
  const slug = Slugs.getNameFromID(term.slugID);
  const name = AcademicTerms.toString(opportunityInstance.termID, false);
  const opportunityName = opportunityIdToName(opportunityInstance.opportunityID);
  return (
    <Grid.Row columns="equal">
      <Grid.Column>
        <AcademicTermLabel slug={slug} name={name} />
      </Grid.Column>
      <Grid.Column>
        {opportunityName}
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentUnverifiedOpportunityItem;
