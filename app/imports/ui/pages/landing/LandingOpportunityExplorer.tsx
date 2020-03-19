import React from 'react';
import Markdown from 'react-markdown';
import YouTube from 'react-youtube';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Label, Segment } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IOpportunity } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { withListSubscriptions } from '../../layouts/shared/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import { getOpportunityTypeName, semesters, teaser } from '../../components/landing/helper-functions';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

interface IOpportunityExplorerProps {
  opportunity: IOpportunity;
  quarters: boolean;
  location: object;
  history: object;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const LandingOpportunityExplorer = (props: IOpportunityExplorerProps) => {
  // console.log(props.opportunity);
  const opts = {
    height: '390',
    width: '640',
  };
  const videoID = teaser(props.opportunity);
  const { match } = props;
  // console.log(videoID);
  return (
    <div>
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
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
                <span>{props.opportunity.name}</span>
              </Header>
              <Grid columns={2} stackable>
                <Grid.Column width="six">
                  <b>Opportunity Type:</b>
                  {' '}
                  {getOpportunityTypeName(props.opportunity.opportunityTypeID)}
                  <br />
                </Grid.Column>
                <Grid.Column width="ten">
                  <b>{(props.quarters ? 'Quarters' : 'Semesters')}</b>
                  {' '}
                  {semesters(props.opportunity)}
                </Grid.Column>
              </Grid>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={props.opportunity.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
              <b>Teaser:</b>
              <br />
              {teaser(props.opportunity) ? <YouTube videoId={videoID} opts={opts} /> : <Label>N/A</Label>}
              <Header as="h4" dividing>Opportunity Interests</Header>
              <LandingInterestList interestIDs={props.opportunity.interestIDs} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
    </div>
  );
};

const WithSubs = withListSubscriptions(LandingOpportunityExplorer, [
  AcademicTerms.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
  Teasers.getPublicationName(),
]);

const LandingOpportunityExplorerCon = withRouter(WithSubs);

const LandingOpportunityExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.opportunity;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'Opportunity');
  return {
    opportunity: Opportunities.findDoc(id),
    quarters: RadGradProperties.getQuarterSystem(),
  };
})(LandingOpportunityExplorerCon);

export default LandingOpportunityExplorerContainer;
