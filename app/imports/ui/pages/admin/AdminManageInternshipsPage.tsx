import React, { useState } from 'react';
import { Button, Message, Progress } from 'semantic-ui-react';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Internships } from '../../../api/internship/InternshipCollection';
import { incrementMissedUploadsMethod, removeAllInternshipsMethod } from '../../../api/internship/InternshipCollection.methods';
import RadGradSegment from '../../components/shared/RadGradSegment';
import { PAGEIDS } from '../../utilities/PageIDs';
import RadGradAlert from '../../utilities/RadGradAlert';
import PageLayout from '../PageLayout';
import { processInternAlohaInternships } from '../../../api/internship/import/process-canonical';

const headerPaneTitle = 'Internship Management';
const headerPaneBody = 'Tools to get internships from InternAloha and define them in the RadGrad database.';

const AdminManageInternshipsPage: React.FC = () => {
  const [deleteWorking, setDeleteWorking] = useState(false);
  const [uploadWorking, setUploadWorking] = useState(false);
  const [defineWorking, setDefineWorking] = useState(false);
  const [defineProgress, setDefineProgress] = useState(0);
  const [internships, setInternships] = useState([]);
  const [message, setMessage] = useState('Click the Upload internships button');

  const handleDeleteClick = () => {
    setDeleteWorking(true);
    removeAllInternshipsMethod.callPromise({});
    setMessage('Cleared internships');
    setDeleteWorking(false);
  };

  const handleUploadClick = async () => {
    setUploadWorking(true);
    await incrementMissedUploadsMethod.callPromise({});
    const gottenInternships = await processInternAlohaInternships();
    setInternships(gottenInternships);
    setMessage(`Uploaded ${gottenInternships.length} internships`);
    setUploadWorking(false);
    setDefineProgress(0);
  };

  const defineInternships = async () => {
    setDefineWorking(true);
    const collectionName = Internships.getCollectionName();
    const numInternships = internships.length;
    let numDefined = 0;
    let progress = 0;
    for (const definitionData of internships) {
      // eslint-disable-next-line no-await-in-loop
      await defineMethod.callPromise({ collectionName, definitionData }).catch(error => RadGradAlert.failure('Define internship failed', `${definitionData.postion}`, error.message));
      numDefined++;
      progress = numDefined / numInternships * 100;
      if (numDefined % 100 === 0) {
        setDefineProgress(progress);
      }
    }
    setMessage(`Defined ${internships.length} internships`);
    setDefineWorking(false);
  };

  return (
    <PageLayout id={PAGEIDS.MANAGE_INTERNSHIPS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Button color="red" onClick={handleDeleteClick} loading={deleteWorking}>
        Delete internships
      </Button>{' '}
      <Button onClick={handleUploadClick} loading={uploadWorking}>
        Upload internships
      </Button>{' '}
      <Button onClick={defineInternships} loading={defineWorking}>
        Define Internships
      </Button>
      {defineWorking ? <RadGradSegment header="Defining internships"><Progress percent={defineProgress} indicating /></RadGradSegment> : ''}
      <Message>
        <Message.Header>{message}</Message.Header>
      </Message>
    </PageLayout>
  );
};

export default AdminManageInternshipsPage;
