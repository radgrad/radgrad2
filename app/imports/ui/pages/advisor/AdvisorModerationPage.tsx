import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import ModerationWidgetContainer from '../../components/shared/ModerationWidget';

/** A simple static component to render some text for the landing page. */
class AdvisorModerationPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>
          <Grid.Column>
            <Grid.Row>
              <HelpPanelWidgetContainer/>
            </Grid.Row>
            <Grid.Row>
            <ModerationWidgetContainer/>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdvisorModerationPageCon = withGlobalSubscription(AdvisorModerationPage);
const AdvisorModerationPageContainer = withInstanceSubscriptions(AdvisorModerationPageCon);

export default AdvisorModerationPageContainer;
