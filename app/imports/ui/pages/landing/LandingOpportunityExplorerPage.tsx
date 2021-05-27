import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Embed, Grid } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { Opportunity } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import { getOpportunityTypeName, semesters, teaser } from '../../components/landing/utilities/helper-functions';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as Router from '../../components/shared/utilities/router';
import { Users } from '../../../api/user/UserCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface OpportunityExplorerProps {
  opportunity: Opportunity;
  quarters: boolean;
}

const headerPaneTitle = 'The Opportunity Explorer';
const headerPaneBody = `
Opportunities are extracurricular activities that relate to this discipline. They are curated by the faculty to ensure that each Opportunity provides an educationally enriching experience.  Registered users can access reviews of (re-occuring) Opportunities to learn about the experiences of previous students. Registered users can also build community by finding other users who are interested in this Opportunity.

This public explorer does not provide information about community members or the reviews associated with Opportunities.
`;

const LandingOpportunityExplorerPage: React.FC<OpportunityExplorerProps> = ({ opportunity, quarters }) => {
  const match = useRouteMatch();
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID }).length > 0;
  const opportunityTypeName = getOpportunityTypeName(opportunity.opportunityTypeID);
  const academicTerms = semesters(opportunity);
  const teaserID = teaser(opportunity);
  const sponsor = Users.getFullName(opportunity.sponsorID);

  return (
    <div>
      <LandingExplorerMenuBar/>
      <PageLayout id={PAGEIDS.LANDING_OPPORTUNITY_EXPLORER} headerPaneTitle={headerPaneTitle}
                  headerPaneBody={headerPaneBody}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>

          <Grid.Column width={13}>
            <RadGradSegment header={<RadGradHeader title={opportunity.name} dividing />}>
              {hasTeaser ? (
                <React.Fragment>
                  <Grid stackable columns={2}>
                    <Grid.Column width={9}>
                      <b>Opportunity Type: </b>
                      {opportunityTypeName ? (
                        <React.Fragment>
                          {opportunityTypeName} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}

                      <b>{quarters ? 'Quarters' : 'Academic Terms'}: </b>
                      {academicTerms.length > 0 ? (
                        <React.Fragment>
                          {academicTerms} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}

                      <b>Sponsor: </b>
                      {sponsor ? (
                        <React.Fragment>
                          {sponsor} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}

                      <b>Description: </b>
                      {opportunity.description ? <Markdown escapeHtml source={opportunity.description} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : 'N/A'}
                    </Grid.Column>

                    <Grid.Column width={7}>
                      <b>Event Date: </b>
                      {opportunity.eventDate ? (
                        <React.Fragment>
                          {opportunity.eventDate} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}

                      <b>Teaser: </b>
                      {teaserID ? <Embed active autoplay={false} source="youtube" id={teaserID} /> : 'N/A'}
                    </Grid.Column>
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid stackable columns={2}>
                    <Grid.Column width={5}>
                      <b>Opportunity Type: </b>
                      {opportunityTypeName ? (
                        <React.Fragment>
                          {opportunityTypeName} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}

                      <b>Sponsor: </b>
                      {sponsor ? (
                        <React.Fragment>
                          {sponsor} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </Grid.Column>

                    <Grid.Column width={11}>
                      <b>{quarters ? 'Quarters' : 'Academic Terms'}: </b>
                      {academicTerms.length > 0 ? (
                        <React.Fragment>
                          {academicTerms} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}

                      <b>Event Date: </b>
                      {opportunity.eventDate ? (
                        <React.Fragment>
                          {opportunity.eventDate} <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </Grid.Column>
                  </Grid>

                  <Grid stackable columns={1}>
                    <Grid.Column>
                      <b>Description: </b>
                      {opportunity.description ? <Markdown escapeHtml source={opportunity.description} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : 'N/A'}
                    </Grid.Column>
                  </Grid>
                </React.Fragment>
              )}
            </RadGradSegment>
            <RadGradSegment header={<RadGradHeader title='Related Interests' icon={EXPLORER_TYPE_ICON.INTEREST} dividing/>}>{opportunity.interestIDs.length > 0 ? <LandingInterestList interestIDs={opportunity.interestIDs} size='small' /> : 'N/A'}</RadGradSegment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </PageLayout>
    </div>
  );
};

const LandingOpportunityExplorerContainer = withTracker(() => {
  const { opportunity } = useParams();
  const id = Slugs.getEntityID(opportunity, 'Opportunity');
  const opportunityDoc = Opportunities.findDoc(id);
  const quarters = RadGradProperties.getQuarterSystem();
  return {
    opportunity: opportunityDoc,
    quarters,
  };
})(LandingOpportunityExplorerPage);

export default withListSubscriptions(LandingOpportunityExplorerContainer, [
  AcademicTerms.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
  Teasers.getPublicationName(),
  FacultyProfiles.getPublicationName(),
  AdvisorProfiles.getPublicationName(),
  Users.getPublicationName(),
]);
