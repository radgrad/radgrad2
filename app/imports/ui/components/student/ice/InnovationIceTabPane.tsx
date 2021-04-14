import React from 'react';
import { Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import PreferredChoice from '../../../../api/degree-plan/PreferredChoice';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import {
  OpportunityInstance,
  ProfileInterest,
  ProfileOpportunity,
} from '../../../../typings/radgrad';
import StudentRecommendedOpportunityItem from '../shared/StudentRecommendedOpportunityItem';
import StudentUnverifiedOpportunityItem from '../shared/StudentUnverifiedOpportunityItem';
import StudentVerifiedOpportunityItem from '../verification-requests/StudentVerifiedOpportunityItem';
import PageIceCircle from './PageIceCircle';

interface InnovationIceTabPaneProps {
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: number;
  earnedICE: number;
}

const getRecommendedOpportunities = (interestIDs: string[], projectedICE) => {
  let projected = projectedICE;
  const opportunities = Opportunities.findNonRetired();
  const choices = new PreferredChoice(opportunities, interestIDs);
  const bestChoices = choices.getBestChoices();
  const recommended = [];
  while (projected < 100) {
    const item = bestChoices.shift();
    projected += item.ice.i;
    recommended.push(item);
  }
  return recommended;
};

const InnovationIceTabPane: React.FC<InnovationIceTabPaneProps> = ({
  projectedICE,
  earnedICE,
  profileOpportunities,
  profileInterests,
  opportunityInstances,
}) => {
  const verifiedOIs = opportunityInstances.filter((oi) => oi.verified);
  let unVerifiedOIs = opportunityInstances.filter((oi) => !oi.verified);
  const currentAcademicTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  unVerifiedOIs = unVerifiedOIs.filter((oi) => AcademicTerms.findDoc(oi.termID).termNumber < currentAcademicTermNum);
  const interestIDs = profileInterests.map((pi) => pi.interestID);
  const recommended = getRecommendedOpportunities(interestIDs, projectedICE);
  const panes = [
    {
      menuItem: 'GET TO 100',
      render: () => {
        let fragment: JSX.Element;
        if (earnedICE >= 100) {
          fragment = <p>Congratulations! You have 100 (or more) verified innovation points!</p>;
        } else if (projectedICE >= 100) {
          fragment = <p>You already have at least 100 verified or unverified innovation points.</p>;
        } else if (profileInterests.length === 0) {
          fragment = <p>Consider adding interests to see recommendations here.</p>;
        } else {
          fragment = <Grid stackable>
            {recommended.map((opp) => <StudentRecommendedOpportunityItem opportunityID={opp._id} key={opp._id} />)}
          </Grid>;
        }
        return (
          <Tab.Pane>{fragment}</Tab.Pane>
        );
      },
    },
    {
      menuItem: `UNVERIFIED (${unVerifiedOIs.length})`,
      render: () => <Tab.Pane>
        <Grid stackable>
          {unVerifiedOIs.map((oi) => <StudentUnverifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
        </Grid>
      </Tab.Pane>,
    },
    {
      menuItem: `VERIFIED (${verifiedOIs.length})`,
      render: () => <Tab.Pane>
        <Grid stackable>
          {verifiedOIs.map((oi) => <StudentVerifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
        </Grid>
      </Tab.Pane>,
    },

  ];
  return (
    <Segment basic>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column textAlign='left' width={4}>
            <PageIceCircle earned={earnedICE} planned={projectedICE} type="innov" />
          </Grid.Column>
          <Grid.Column width={12}>
            <Header as="h3" className="ice-innovation-color">
              INNOVATION
            </Header>
            <p>You earn innovation points by completing opportunities that involve &quot;innovation&quot;, such as <b>research
              projects, hackathons, or other activities producing new insights or technologies.</b></p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Tab panes={panes} />
    </Segment>
  );
};

export default InnovationIceTabPane;
