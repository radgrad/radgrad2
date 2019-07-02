import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IDesiredDegree } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import * as Router from '../../components/shared/RouterHelperFunctions';

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
                  <span>{this.props.desiredDegree.name}</span>
                </Header>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.desiredDegree.description}
                          renderers={{ link: Router.renderLink }}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

const WithSubs = withListSubscriptions(DesiredDegreeExplorer, [
  DesiredDegrees.getPublicationName(),
  Slugs.getPublicationName(),
]);

const LandingDesiredDegreeExplorerCon = withRouter(WithSubs);

const LandingDesiredDegreeExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.degree;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'DesiredDegree');
  return {
    desiredDegree: DesiredDegrees.findDoc(id),
  };
})(LandingDesiredDegreeExplorerCon);

export default LandingDesiredDegreeExplorerContainer;
