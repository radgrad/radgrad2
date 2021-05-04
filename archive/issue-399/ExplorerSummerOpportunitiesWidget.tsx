import React from 'react';
import { Divider, Header, Image } from 'semantic-ui-react';
import OpportunityInformationItem, { OpportunityInformationItemConfiguration } from './OpportunityInformationItem';
import { AcademicTerm, Opportunity, OpportunityType } from '../../app/imports/typings/radgrad';
import { Opportunities } from '../../app/imports/api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../app/imports/api/opportunity/OpportunityTypeCollection';
import { AcademicTerms } from '../../app/imports/api/academic-term/AcademicTermCollection';

const opportunityInformationItemConfiguration: OpportunityInformationItemConfiguration = {
  showLogo: false,
  showMetadata: false,
  showStudentsParticipating: false,
};

const getSummerOpportunities = (): Opportunity[] => {
  const currentAcademicTerm: AcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const futureSummerAcademicTerms: AcademicTerm[] = AcademicTerms.findNonRetired({
    term: 'Summer',
    termNumber: { $gt: currentAcademicTerm.termNumber },
  });
  const futureSummerAcademicTermIDs: string[] = futureSummerAcademicTerms.map((term) => term._id);
  const internshipOpportunityType: OpportunityType = OpportunityTypes.findOne({ name: 'Internship' });
  return Opportunities.findNonRetired({
    opportunityTypeID: internshipOpportunityType._id,
    termIDs: { $in: futureSummerAcademicTermIDs },
  });
};

const ExplorerSummerOpportunitiesWidget: React.FC = () => {
  const numberOfOpportunities = 3;
  const allSummerInternshipOpportunities: Opportunity[] = getSummerOpportunities();
  const summerInternshipOpportunities = allSummerInternshipOpportunities.slice(0, numberOfOpportunities);
  return (
    <>
      <Image src="/images/banners/summer_internships.png" />
      <Header>SUMMER INTERNSHIP OPPORTUNITIES</Header>
      <Divider />
      {summerInternshipOpportunities.map((opportunity) => (
        <OpportunityInformationItem key={opportunity._id} opportunity={opportunity} informationConfiguration={opportunityInformationItemConfiguration} />
      ))}
    </>
  );
};

export default ExplorerSummerOpportunitiesWidget;
