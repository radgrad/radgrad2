import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import AdminPageMenu from '../../../../app/imports/ui/components/admin/AdminPageMenu';
import AdminDataModelMenu, { AdminDataModeMenuProps } from '../../../../app/imports/ui/components/admin/datamodel/AdminDataModelMenu';
import UploadFixtureWidget from '../../../../app/imports/ui/components/admin/datamodel/UploadFixtureWidget';
import BackToTopButton from '../../../../app/imports/ui/components/shared/BackToTopButton';
import { getDatamodelCount } from '../../../../app/imports/ui/pages/admin/utilities/datamodel';

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelPage: React.FC<AdminDataModeMenuProps> = (props) => {
  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div id="admin-data-model-page" className="layout-page">
      <AdminPageMenu />
      <Grid container stackable style={paddedStyle}>
        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          <Message floating content="Click on a data model element in the menu to the left to display those items." />
          <UploadFixtureWidget />
        </Grid.Column>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelPageContainer = withTracker(() => {
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
  };
})(AdminDataModelPage);

export default AdminDataModelPageContainer;
