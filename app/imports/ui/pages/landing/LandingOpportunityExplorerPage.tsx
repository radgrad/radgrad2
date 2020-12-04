import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Embed, Grid, Header, Segment } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IHelpMessage, IOpportunity } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import { getOpportunityTypeName, semesters, teaser } from '../../components/landing/utilities/helper-functions';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { Users } from '../../../api/user/UserCollection';

// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

interface IOpportunityExplorerProps {
  opportunity: IOpportunity;
  quarters: boolean;
  helpMessages: IHelpMessage[];
}

const LandingOpportunityExplorerPage: React.FC<IOpportunityExplorerProps> = (props) => {
  const match = useRouteMatch();
  const { opportunity } = props;
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID }).length > 0;
  const opportunityTypeName = getOpportunityTypeName(opportunity.opportunityTypeID);
  const academicTerms = semesters(opportunity);
  const teaserID = teaser(opportunity);
  const sponsor = Users.getFullName(opportunity.sponsorID);

  return (
    <div id="landing-opportunity-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={props.helpMessages} /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>

          <Grid.Column width={11}>
            <Segment padded style={{ overflow: 'auto', maxHeight: 750 }}>
              <Header as="h4" dividing>
                <span>{opportunity.name}</span>
              </Header>
              {hasTeaser ?
                (
                  <React.Fragment>
                    <Grid stackable columns={2}>
                      <Grid.Column width={9}>
                        <b>Opportunity Type: </b>
                        {opportunityTypeName ?
                          (<React.Fragment>{opportunityTypeName} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}

                        <b>{(props.quarters ? 'Quarters' : 'Academic Terms')}: </b>
                        {academicTerms.length > 0 ?
                          (<React.Fragment>{academicTerms} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}

                        <b>Sponsor: </b>
                        {sponsor ?
                          (<React.Fragment>{sponsor} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}

                        <b>Description: </b>
                        {opportunity.description ?
                          (
                            <Markdown
                              escapeHtml
                              source={opportunity.description}
                              renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                            />
                          )
                          : 'N/A'}
                      </Grid.Column>

                      <Grid.Column width={7}>
                        <b>Event Date: </b>
                        {opportunity.eventDate ?
                          (<React.Fragment>{opportunity.eventDate} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}

                        <b>Teaser: </b>
                        {teaserID ?
                          (
                            <Embed
                              active
                              autoplay={false}
                              source="youtube"
                              id={teaserID}
                            />
                          )
                          : 'N/A'}
                      </Grid.Column>
                    </Grid>
                    <LandingInterestList interestIDs={opportunity.interestIDs} />
                  </React.Fragment>
                )
                :
                (
                  <React.Fragment>
                    <Grid stackable columns={2}>
                      <Grid.Column width={5}>
                        <b>Opportunity Type: </b>
                        {opportunityTypeName ?
                          (<React.Fragment>{opportunityTypeName} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}

                        <b>Sponsor: </b>
                        {sponsor ?
                          (<React.Fragment>{sponsor} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}
                      </Grid.Column>

                      <Grid.Column width={11}>
                        <b>{(props.quarters ? 'Quarters' : 'Academic Terms')}: </b>
                        {academicTerms.length > 0 ?
                          (<React.Fragment>{academicTerms} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}

                        <b>Event Date: </b>
                        {opportunity.eventDate ?
                          (<React.Fragment>{opportunity.eventDate} <br /></React.Fragment>)
                          : (<React.Fragment>N/A <br /></React.Fragment>)}
                      </Grid.Column>
                    </Grid>

                    <Grid stackable columns={1}>
                      <Grid.Column>
                        <b>Description: </b>
                        {opportunity.description ?
                          (
                            <Markdown
                              escapeHtml
                              source={opportunity.description}
                              renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                            />
                          )
                          : 'N/A'}
                      </Grid.Column>
                    </Grid>
                  </React.Fragment>
                )}
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
    </div>
  );
};

const WithSubs = withListSubscriptions(LandingOpportunityExplorerPage, [
  AcademicTerms.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
  Teasers.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

const LandingOpportunityExplorerContainer = withTracker(() => {
  const { opportunity } = useParams();
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(opportunity, 'Opportunity');
  return {
    opportunity: Opportunities.findDoc(id),
    quarters: RadGradProperties.getQuarterSystem(),
    helpMessages: HelpMessages.findNonRetired({}),
  };
})(WithSubs);

export default LandingOpportunityExplorerContainer;
