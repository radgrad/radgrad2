import * as React from 'react';
import * as Markdown from 'react-markdown';
import YouTube from 'react-youtube';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Label, Segment } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IOpportunity } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import InterestList from '../../components/landing/InterestList';
import LandingPrerequisiteList from '../../components/landing/LandingPrerequisiteList';
import { getOpportunityTypeName, semesters, teaser } from '../../components/landing/helper-functions';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import OpportunityTeaser from '../../components/landing/OpportunityTeaser';
// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

interface IOpportunityExplorerProps {
  opportunity: IOpportunity;
  match: object;
  location: object;
  history: object;
}

class LandingOpportunityExplorer extends React.Component<IOpportunityExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.opportunity);
    const opts = {
      height: '390',
      width: '640',
    };
    const videoID = teaser(this.props.opportunity);
    console.log(videoID);
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/*<Grid.Row>*/}
          {/*<HelpPanelWidgetContainer routeProps={this.props.location}/>*/}
          {/*</Grid.Row>*/}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>{this.props.opportunity.name}</span>
                </Header>
                <Grid columns={2} stackable={true}>
                  <Grid.Column width={'six'}>
                    <b>Opportunity Type:</b> {getOpportunityTypeName(this.props.opportunity.opportunityTypeID)}<br/>
                  </Grid.Column>
                  <Grid.Column width={'ten'}>
                    <b>Semesters</b> {semesters(this.props.opportunity)}
                  </Grid.Column>
                </Grid>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.opportunity.description}/>
                <b>Teaser:</b><br/>
                {teaser(this.props.opportunity) ? <YouTube videoId={videoID} opts={opts}/> : <Label>N/A</Label>}
                <Header as="h4" dividing={true}>Opportunity Interests</Header>
                <InterestList interestIDs={this.props.opportunity.interestIDs}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const WithSubs = withListSubscriptions(LandingOpportunityExplorer, [
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Semesters.getPublicationName(),
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
  };
})(LandingOpportunityExplorerCon);

export default LandingOpportunityExplorerContainer;
