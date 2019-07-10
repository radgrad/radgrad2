import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminModerationWidget from '../../components/shared/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';


/** A simple static component to render some text for the landing page. */
class AdminModerationPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>
          <Grid.Column>
            <AdminModerationWidget/>
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdminModerationPage;
