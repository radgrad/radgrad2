import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import MentorAboutMeWidget from '../../components/mentor/MentorAboutMeWidget';

/** A simple static component to render some text for the landing page. */
class MentorHomePage extends React.Component {
  public render() {
    return (
      <div>
        <MentorPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={16}>
            <MentorAboutMeWidget/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const MentorHomePageCon = withGlobalSubscription(MentorHomePage);
const MentorHomePageContainer = withInstanceSubscriptions(MentorHomePageCon);

export default MentorHomePageContainer;
