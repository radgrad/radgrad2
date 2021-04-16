import React from 'react';
import { Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import {
  OpportunityInstance,
  ProfileInterest,
  ProfileOpportunity,
} from '../../../../typings/radgrad';
import { STUDENT_VERIFICATION, URL_ROLES } from '../../../layouts/utilities/route-constants';
import { ButtonLink } from '../../shared/button/ButtonLink';
import StudentRecommendedOpportunityItem from '../shared/StudentRecommendedOpportunityItem';
import PageIceCircle from './PageIceCircle';
import { getRecommendedOpportunities } from './utilities/recommended';

interface InnovationIceTabPaneProps {
  username: string;
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: number;
  earnedICE: number;
}

const InnovationIceTabPane: React.FC<InnovationIceTabPaneProps> = ({
  username,
  projectedICE,
  earnedICE,
  profileOpportunities,
  profileInterests,
  opportunityInstances,
}) => {
  let unVerifiedOIs = opportunityInstances.filter((oi) => !oi.verified);
  const currentAcademicTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  unVerifiedOIs = unVerifiedOIs.filter((oi) => AcademicTerms.findDoc(oi.termID).termNumber < currentAcademicTermNum);
  const interestIDs = profileInterests.map((pi) => pi.interestID);
  const recommended = getRecommendedOpportunities(interestIDs, projectedICE, 'i');
  return (
    <Tab.Pane>
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
              <p>You have <strong>{earnedICE}</strong> verified innovation points. This appears as a number in the
                center
                of the circle. It is also represented by the darkly colored portion of the circle. You
                have <strong>{projectedICE}</strong> unverified innovation points. This appears as
                the lightly colored portion of the circle.</p>
              {unVerifiedOIs.length > 0 ?
                <p>You have {unVerifiedOIs.length} opportunit{unVerifiedOIs.length > 1 ? 'ies' : 'y'} without
                  verification
                  requests. Visit the Verification Page to request verification. <ButtonLink
                    url={`/${URL_ROLES.STUDENT}/${username}/${STUDENT_VERIFICATION}`} label='Verification Page'
                    size='mini' /></p> : ''}
              {projectedICE < 100 ?
                <p>You don&quot;t have enough innovative opportunities in your degree experience plan.
                  <Grid stackable>
                    {recommended.map((opp) => <StudentRecommendedOpportunityItem opportunityID={opp._id}
                                                                                 key={opp._id} />)}
                  </Grid></p> : ''}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Tab.Pane>
  );
};

export default InnovationIceTabPane;
