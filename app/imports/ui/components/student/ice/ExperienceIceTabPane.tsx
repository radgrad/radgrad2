import React from 'react';
import { Grid, Header, List, Segment, Tab } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import {
  OpportunityInstance,
  ProfileInterest,
  ProfileOpportunity,
} from '../../../../typings/radgrad';
import { STUDENT_VERIFICATION, URL_ROLES } from '../../../layouts/utilities/route-constants';
import { ButtonLink } from '../../shared/button/ButtonLink';
import OpportunityList from '../../shared/OpportunityList';
import PageIceCircle from './PageIceCircle';
import { getRecommendedOpportunities } from './utilities/recommended';

interface ExperienceIceTabPaneProps {
  username: string;
  profileID: string;
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: number;
  earnedICE: number;
}

const ExperienceIceTabPane: React.FC<ExperienceIceTabPaneProps> = ({
  username,
  profileID,
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
  const recommended = getRecommendedOpportunities(interestIDs, projectedICE, 'e');
  return (
    <Tab.Pane>
      <Segment basic>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column textAlign='left' width={4}>
              <PageIceCircle earned={earnedICE} planned={projectedICE} type="exp" />
            </Grid.Column>
            <Grid.Column width={12}>
              <Header as="h3" className="ice-experience-color">
                EXPERIENCE
              </Header>
              <p>You earn Experience points by completing opportunities that provide &#8220;real world
                experience&#8220;, such as <strong>internships</strong> or <strong>business plan competitions</strong>.</p>
              <p>Right now, you have <strong>{earnedICE}</strong> verified Experience points. This appears as the number in the center of the first circle (although the displayed value is capped at 100). Your verified points are also represented by the darkly colored portion of the circle. Only verified points enable you to achieve new Levels in RadGrad.</p>
              <p>Your grand total for Experience is <strong>{projectedICE}</strong>. This includes both verified Opportunities plus Opportunities that you have planned to carry out but have not yet verified.  If some of your planned Opportunities are not yet verified, then you might see these points represented as a lightly colored portion of the circle.</p>
              {unVerifiedOIs.length > 0 ?
                <p>You have {unVerifiedOIs.length} opportunit{unVerifiedOIs.length > 1 ? 'ies' : 'y'} without
                  verification
                  requests. Visit the Verification Page to request verification. <ButtonLink
                  url={`/${URL_ROLES.STUDENT}/${username}/${STUDENT_VERIFICATION}`} label='Verification Page'
                  size='mini' /></p> : ''}
              {projectedICE < 100 ?
                <div><p>You don&quot;t have enough experiential opportunities in your degree experience plan. Here are
                  some recommended opportunities that match your interests:</p>
                <OpportunityList opportunities={recommended} size='large' keyStr='recommended' userID={profileID} />
                <List ordered>
                  <List.Item>View the opportunity by clicking on the label.</List.Item>
                  <List.Item>If you like the opportunity, add it to your profile.</List.Item>
                  <List.Item>Then go to the Planner page and add the opportunity to your degree experience plan.</List.Item>
                </List>
                </div> : ''}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Tab.Pane>
  );
};

export default ExperienceIceTabPane;
