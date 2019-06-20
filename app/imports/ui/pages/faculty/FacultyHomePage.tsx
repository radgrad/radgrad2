import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/FacultyPageAboutMeWidget';

/** A simple static component to render some text for the landing page. */
class FacultyHomePage extends React.Component {
  public render() {
    const moveDownStyle = {
      marginTop: 10,
    };
    return (
      <div>
        <FacultyPageMenuWidget/>
        <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidgetContainer/></Grid.Column>
          </Grid.Row>

          <Grid.Column width={16}>
            <FacultyPageAboutMeWidget/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const FacultyHomePageCon = withGlobalSubscription(FacultyHomePage);
const FacultyHomePageContainer = withInstanceSubscriptions(FacultyHomePageCon);

export default FacultyHomePageContainer;
