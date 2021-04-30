import React from 'react';
import { Grid } from 'semantic-ui-react';
import CheckIntegrity from '../../components/admin/database/CheckIntegrity';
import DumpFixture from '../../components/admin/database/DumpFixture';
import DumpStudentEmails from '../../components/admin/database/DumpStudentEmails';
import UploadFixture from '../../components/admin/database/UploadFixture';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';
const headerPaneTitle = 'Database Management';
const headerPaneBody = 'Tools to upload, download, and otherwise manage the RadGrad database.';

const AdminDatabaseManagementPage: React.FC = () => (
  <PageLayout id={PAGEIDS.DATABASE_MANAGEMENT} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Grid stackable columns='equal'>
      <Grid.Row>
        <Grid.Column><UploadFixture /></Grid.Column>
        <Grid.Column><DumpFixture /></Grid.Column>
        <Grid.Column><DumpStudentEmails /></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column><CheckIntegrity /></Grid.Column>
      </Grid.Row>
    </Grid>
  </PageLayout>
);

export default AdminDatabaseManagementPage;
