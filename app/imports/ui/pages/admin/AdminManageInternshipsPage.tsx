import React, { useState } from 'react';
import { Button, Message } from 'semantic-ui-react';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Internships } from '../../../api/internship/InternshipCollection';
import { incrementMissedUploadsMethod } from '../../../api/internship/InternshipCollection.methods';
import { PAGEIDS } from '../../utilities/PageIDs';
import RadGradAlert from '../../utilities/RadGradAlert';
import PageLayout from '../PageLayout';
import { processInternAlohaInternships } from '../../../api/internship/import/process-canonical';

const headerPaneTitle = 'Internship Management';
const headerPaneBody = 'Tools to get internships from InternAloha and define them in the RadGrad database.';

const AdminManageInternshipsPage: React.FC = () => {
  const [uploadWorking, setUploadWorking] = useState(false);
  const [defineWorking, setDefineWorking] = useState(false);
  const [internships, setInternships] = useState([]);
  const [message, setMessage] = useState('Click the Upload internships button');

  const handleUploadClick = async () => {
    setUploadWorking(true);
    await incrementMissedUploadsMethod.callPromise({});
    const gottenInternships = await processInternAlohaInternships();
    setInternships(gottenInternships);
    setMessage(`Uploaded ${gottenInternships.length} internships`);
    setUploadWorking(false);
  };

  const defineInternships = async () => {
    setDefineWorking(true);
    const collectionName = Internships.getCollectionName();
    for (const definitionData of internships) {
      // eslint-disable-next-line no-await-in-loop
      await defineMethod.callPromise({ collectionName, definitionData }).catch(error => RadGradAlert.failure('Define internship failed', `${definitionData.postion}`, error.message));

    }
    setMessage(`Defined ${internships.length} internships`);
    setDefineWorking(false);
  };

  return (
    <PageLayout id={PAGEIDS.MANAGE_INTERNSHIPS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Button onClick={handleUploadClick} loading={uploadWorking}>Upload internships</Button> <Button onClick={defineInternships} loading={defineWorking}>Define Internships</Button>
      <Message>
        <Message.Header>{message}</Message.Header>
      </Message>
    </PageLayout>
  );
};

export default AdminManageInternshipsPage;
