import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { InternAlohaUrlsEnum } from '../../../api/internship/import/InternAlohaUrls';
import { getInternAlohaInternshipsMethod } from '../../../api/internship/InternshipCollection.methods';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { processCanonical } from '../../../api/internship/import/process-canonical';

const headerPaneTitle = 'Database Management';
const headerPaneBody = 'Tools to upload, download, and otherwise manage the RadGrad database.';

const handleClick = async () => {
  const internships = [];
  const results = await getInternAlohaInternshipsMethod.callPromise({ url: InternAlohaUrlsEnum.ziprecruiter });
  results.forEach((result) => internships.push(processCanonical(result)));
  console.log(internships);
};

const AdminManageInternshipsPage: React.FC = () => (
  <PageLayout id={PAGEIDS.MANAGE_INTERNSHIPS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header>Manage Internships</Header>
    <Button onClick={handleClick}>Get internships</Button>
  </PageLayout>
);

export default AdminManageInternshipsPage;
