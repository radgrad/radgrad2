import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import MentorAboutMeWidget from '../../components/mentor/MentorAboutMeWidget';

/** A simple static component to render some text for the landing page. */
class MentorHomePage extends React.Component {
  public render() {
    const moveDownStyle = {
      marginTop: 10,
    };
    return (
      <div>
        <MentorPageMenuWidget/>
        <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidgetContainer/></Grid.Column>
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
