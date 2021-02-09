// import React from 'react';
// import { Header } from 'semantic-ui-react';
// import { Opportunity } from '../../../../typings/radgrad';
// import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
// import OpportunityInformationItem, { OpportunityInformationItemConfiguration } from '../../shared/explorer/opportunities/OpportunityInformationItem';
//
// const getNewOpportunities = (numOpportunities): Opportunity[] => {
//   // To get the new opportunities, we make the assumption that newer opportunities are added to the end of the collection
//   // therefore, we pull the new opportunities from the end of the collection.
//   const descendingOpportunities: Opportunity[] = Opportunities.findNonRetired({}, { sort: { timestamp: -1 } });
//   return descendingOpportunities.slice(0, numOpportunities);
// };
//
// const opportunityInformationItemConfiguration: OpportunityInformationItemConfiguration = {
//   showLogo: false,
//   showMetadata: false,
//   showStudentsParticipating: false,
// };
//
// const StudentHomeNewOpportunitiesWidget: React.FC = () => {
//   // Number of new opportunities we want to get and display
//   const numOpportunities = 3;
//   const newOpportunities = getNewOpportunities(numOpportunities);
//   return (
//     <>
//       <Header dividing>NEW OPPORTUNITIES</Header>
//       {newOpportunities.map((opportunity) => (
//         <OpportunityInformationItem key={opportunity._id} informationConfiguration={opportunityInformationItemConfiguration} opportunity={opportunity} />
//       ))}
//     </>
//   );
// };
//
// export default StudentHomeNewOpportunitiesWidget;
