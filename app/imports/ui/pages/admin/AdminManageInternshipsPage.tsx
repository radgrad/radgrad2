import React, { useState } from 'react';
import { Button, Message } from 'semantic-ui-react';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Internships } from '../../../api/internship/InternshipCollection';
import { PAGEIDS } from '../../utilities/PageIDs';
import RadGradAlert from '../../utilities/RadGradAlert';
import PageLayout from '../PageLayout';
import { processInternAlohaInternships } from '../../../api/internship/import/process-canonical';

const headerPaneTitle = 'Database Management';
const headerPaneBody = 'Tools to upload, download, and otherwise manage the RadGrad database.';

const AdminManageInternshipsPage: React.FC = () => {
  const [working, setWorking] = useState(false);
  const [defineWorking, setDefineWorking] = useState(false);
  const [internships, setInternships] = useState([]);
  const [message, setMessage] = useState('Click the Get internships button');

  const handleClick = async () => {
    setWorking(true);
    const gottenInternships = await processInternAlohaInternships();
    setInternships(gottenInternships);
    setMessage(`Downloaded ${gottenInternships.length} internships`);
    setWorking(false);
  };

  const defineInternships = async () => {
    setDefineWorking(true);
    const collectionName = Internships.getCollectionName();
    console.log(internships[0], internships[internships.length - 1]);
    for (const definitionData of internships) {
      // eslint-disable-next-line no-await-in-loop
      await defineMethod.callPromise({ collectionName, definitionData }).catch(error => RadGradAlert.failure('Define internship failed', `${definitionData.postion}`, error.message));

    }
    setMessage(`Defined ${internships.length} internships`);
    setDefineWorking(false);
  };

  return (
    <PageLayout id={PAGEIDS.MANAGE_INTERNSHIPS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Button onClick={handleClick} loading={working}>Get internships</Button> <Button onClick={defineInternships} loading={defineWorking}>Define Internships</Button>
      <Message>
        <Message.Header>{message}</Message.Header>
      </Message>
    </PageLayout>
  );
};

export default AdminManageInternshipsPage;
