import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IDesiredDegree } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { withListSubscriptions } from '../../layouts/shared/SubscriptionListHOC';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IDesiredDegreeExplorerProps {
  desiredDegree: IDesiredDegree;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const DesiredDegreeExplorer = (props: IDesiredDegreeExplorerProps) => {
  const { match } = props;
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
                <span>{props.desiredDegree.name}</span>
              </Header>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={props.desiredDegree.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

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
