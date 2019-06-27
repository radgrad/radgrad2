import * as React from 'react';
import * as Markdown from 'react-markdown';
import YouTube from 'react-youtube';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Label, Segment } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import { getOpportunityTypeName, semesters, teaser } from '../../components/landing/helper-functions';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as Router from '../../components/shared/RouterHelperFunctions';
// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

interface IOpportunityExplorerProps {
  opportunity: IOpportunity;
  quarters: boolean;
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
    // console.log(videoID);
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/* <Grid.Row> */}
          {/* <HelpPanelWidgetContainer routeProps={this.props.location}/> */}
          {/* </Grid.Row> */}
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
                    <b>{(this.props.quarters ? 'Quarters' : 'Semesters')}</b> {semesters(this.props.opportunity)}
                  </Grid.Column>
                </Grid>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.opportunity.description}
                          renderers={{ link: Router.renderLink }}/>
                <b>Teaser:</b><br/>
                {teaser(this.props.opportunity) ? <YouTube videoId={videoID} opts={opts}/> : <Label>N/A</Label>}
                <Header as="h4" dividing={true}>Opportunity Interests</Header>
                <LandingInterestList interestIDs={this.props.opportunity.interestIDs}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const WithSubs = withListSubscriptions(LandingOpportunityExplorer, [
  AcademicTerms.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  RadGradSettings.getPublicationName(),
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
    quarters: RadGradSettings.findOne({}).quarterSystem,
  };
})(LandingOpportunityExplorerCon);

export default LandingOpportunityExplorerContainer;
