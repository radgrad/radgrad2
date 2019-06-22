import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import BeautifulExample from '../../components/student/BeautifulExample';
import ModerationWidgetContainer from "../../components/shared/ModerationWidget";

/** A simple static component to render some text for the landing page. */
class AdvisorModerationPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const moveDownStyle = {
      marginTop: 10,
    };
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
          <Grid.Column>
            <ModerationWidgetContainer/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdvisorModerationPageCon = withGlobalSubscription(AdvisorModerationPage);
const AdvisorModerationPageContainer = withInstanceSubscriptions(AdvisorModerationPageCon);

export default AdvisorModerationPageContainer;
