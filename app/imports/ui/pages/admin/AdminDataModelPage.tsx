import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import UploadFixtureWidget from '../../components/admin/UploadFixtureWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

const AdminDataModelPage = () => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div id="admin-data-model-page" className="layout-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          <Message
            floating
            content="Click on a data model element in the menu to the left to display those items."
          />
          <UploadFixtureWidget />
        </Grid.Column>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

export default withInstanceSubscriptions(AdminDataModelPage);
