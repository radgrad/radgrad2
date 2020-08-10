import React from 'react';
import { Header, Card } from 'semantic-ui-react';
import { IOpportunity } from '../../../../typings/radgrad';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import IceHeader from '../../shared/IceHeader';
import { docToShortDescription } from '../../shared/data-model-helper-functions';
import InterestList from '../../shared/InterestList';
import OpportunityStudentsParticipatingWidget from '../OpportunityStudentsParticipatingWidget';

const getNewOpportunities = (numOpportunities): IOpportunity[] => {
  // To get the new opportunities, we make the assumption that newer opportunities are added to the end of the collection
  // therefore, we pull the new opportunities from the end of the collection.
  const descendingOpportunities: IOpportunity[] = Opportunities.findNonRetired({}, { sort: { timestamp: -1 } });
  return descendingOpportunities.slice(0, numOpportunities);
};

const StudentHomeNewOpportunitiesWidget = () => {
  // Number of new opportunities we want to get and display
  const numOpportunities = 3;
  const newOpportunities = getNewOpportunities(numOpportunities);
  return (
    <>
      <Header dividing>NEW OPPORTUNITIES</Header>
      <Card.Group>
        {newOpportunities.map((opportunity) => (
          <Card key={opportunity._id}>
            <Card.Content>
              <IceHeader ice={opportunity.ice} />
              <Card.Header>{opportunity.name}</Card.Header>
              <Card.Description>
                {docToShortDescription(opportunity)}...
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <InterestList item={opportunity} />
              <OpportunityStudentsParticipatingWidget opportunity={opportunity} />
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
};

export default StudentHomeNewOpportunitiesWidget;
