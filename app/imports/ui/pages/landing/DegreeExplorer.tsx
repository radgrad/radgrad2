import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Icon, Image, Label, Loader, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { IDesiredDegree } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import withGenericSubscriptions from '../../layouts/shared/GenericSubscriptionHOC';
import InterestList from '../../components/landing/InterestList';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IDesiredDegreeExplorerProps {
  desiredDegree: IDesiredDegree;
  match: object;
  location: object;
  history: object;
}

class DesiredDegreeExplorer extends React.Component<IDesiredDegreeExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.desiredDegree);
    const inlineStyle = {
      maxHeight: 750,
      marginTop: 10,
    };
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
                  <span>{this.props.desiredDegree.name}</span>
                </Header>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.desiredDegree.description}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

const WithSubs = withGenericSubscriptions(DesiredDegreeExplorer, [
  DesiredDegrees.getCollectionName(),
  Slugs.getPublicationName(),
]);

const DesiredDegreeExplorerCon = withRouter(WithSubs);

const DesiredDegreeExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.degree;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'DesiredDegree');
  return {
    desiredDegree: DesiredDegrees.findDoc(id),
  };
})(DesiredDegreeExplorerCon);

export default DesiredDegreeExplorerContainer;
