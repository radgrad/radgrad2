import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/FacultyPageAboutMeWidget';

/** A simple static component to render some text for the landing page. */
class FacultyHomePage extends React.Component {
  public render() {
    return (
      <div>
        <FacultyPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
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
