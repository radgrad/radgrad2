import React from 'react';
import { Divider, Header, Image } from 'semantic-ui-react';
import OpportunityInformationItem, { IOpportunityInformationItemConfiguration } from './OpportunityInformationItem';
import { IAcademicTerm, IOpportunity, IOpportunityType } from '../../../../../typings/radgrad';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../../../api/opportunity/OpportunityTypeCollection';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';

const opportunityInformationItemConfiguration: IOpportunityInformationItemConfiguration = {
  showLogo: false,
  showMetadata: false,
  showStudentsParticipating: false,
};

const getSummerOpportunities = (): IOpportunity[] => {
  const currentAcademicTerm: IAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const futureSummerAcademicTerms: IAcademicTerm[] = AcademicTerms.findNonRetired({
    term: 'Summer',
    termNumber: { $gt: currentAcademicTerm.termNumber },
  });
  const futureSummerAcademicTermIDs: string[] = futureSummerAcademicTerms.map((term) => term._id);
  const internshipOpportunityType: IOpportunityType = OpportunityTypes.findOne({ name: 'Internship' });
  return Opportunities.findNonRetired({
    opportunityTypeID: internshipOpportunityType._id,
    termIDs: { $in: futureSummerAcademicTermIDs },
  });
};

const ExplorerSummerOpportunitiesWidget: React.FC = () => {
  const numberOfOpportunities = 3;
  const allSummerInternshipOpportunities: IOpportunity[] = getSummerOpportunities();
  const summerInternshipOpportunities = allSummerInternshipOpportunities.slice(0, numberOfOpportunities);
  return (
    <>
      <Image src="/images/banners/summer_internships.png" />
      <Header>SUMMER INTERNSHIP OPPORTUNITIES</Header>
      <Divider />
      {summerInternshipOpportunities.map((opportunity) => (
        <OpportunityInformationItem
          key={opportunity._id}
          opportunity={opportunity}
          informationConfiguration={opportunityInformationItemConfiguration}
        />
      ))}
    </>
  );
};

export default ExplorerSummerOpportunitiesWidget;
