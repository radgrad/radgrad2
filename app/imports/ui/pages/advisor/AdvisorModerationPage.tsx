import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ModerationWidgetContainer from '../../components/shared/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

class AdvisorModerationPage extends React.Component {
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Row>
            <ModerationWidgetContainer/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const AdvisorModerationPageCon = withGlobalSubscription(AdvisorModerationPage);
const AdvisorModerationPageContainer = withInstanceSubscriptions(AdvisorModerationPageCon);

export default AdvisorModerationPageContainer;
