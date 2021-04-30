import React from 'react';
import { Grid } from 'semantic-ui-react';
import DumpFixture from '../../components/admin/database/DumpFixture';
import DumpStudentEmails from '../../components/admin/database/DumpStudentEmails';
import UploadFixture from '../../components/admin/database/UploadFixture';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const AdminDatabaseDumpPage: React.FC = () => {
  return (
    <PageLayout id={PAGEIDS.DATABASE_DUMP_DATABASE} headerPaneTitle="Database Management">
      <Grid stackable columns='three'>
        <Grid.Column><UploadFixture /></Grid.Column>
        <Grid.Column><DumpFixture /></Grid.Column>
        <Grid.Column><DumpStudentEmails /></Grid.Column>
      </Grid>
    </PageLayout>
  );
};

export default AdminDatabaseDumpPage;
