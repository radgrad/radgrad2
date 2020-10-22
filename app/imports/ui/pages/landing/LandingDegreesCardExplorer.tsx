import React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IDesiredDegree } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface IDegreesCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  // eslint-disable-next-line react/no-unused-prop-types
  count: number;
}

const renderPage = (props: IDegreesCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
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
                <span>DESIRED DEGREES</span> ({props.count})
              </Header>
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const LandingDegreesCardExplorer = (props: IDegreesCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Degrees</Loader>);

const LandingDegreesCardExplorerCon = withRouter(LandingDegreesCardExplorer);

const LandingDegreesCardExplorerContainer = withTracker(() => {
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready:  sub2.ready(),
  };
})(LandingDegreesCardExplorerCon);

export default LandingDegreesCardExplorerContainer;
