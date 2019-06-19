import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminModerationWidget from '../../components/admin/AdminModerationWidget'

/** A simple static component to render some text for the landing page. */
class AdminModerationPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>
          <Grid.Row>
            <Grid.Column>
              <AdminModerationWidget/>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

export default AdminModerationPage;
