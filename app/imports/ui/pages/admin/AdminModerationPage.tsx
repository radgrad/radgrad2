import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminModerationWidget from '../../components/shared/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

const AdminModerationPage = () => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div>
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>
        <Grid.Column>
          <AdminModerationWidget />
        </Grid.Column>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

export default AdminModerationPage;
