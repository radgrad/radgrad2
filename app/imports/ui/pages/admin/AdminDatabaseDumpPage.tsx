import React, { useState } from 'react';
import { Button, Form, Grid, Message } from 'semantic-ui-react';
import moment from 'moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { dumpDatabaseMethod } from '../../../api/base/BaseCollection.methods';
import { generateStudentEmailsMethod } from '../../../api/user/UserCollection.methods';
import AdminDatabaseAccordion from '../../components/admin/database/AdminDatabaseAccordion';
import UploadFixture from '../../components/admin/datamodel/UploadFixture';
import { PAGEIDS } from '../../utilities/PageIDs';
import { useStickyState } from '../../utilities/StickyState';
import PageLayout from '../PageLayout';

interface Collection {
  name?: string;
  contents?: string[];
}

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const AdminDatabaseDumpPage: React.FC = () => {
  const [isErrorState, setIsError] = useState(false);
  const [resultsState, setResults] = useState([]);
  const [dumpInProgress, setDumpInProgress] = useStickyState('AdminDatabaseDumpPage.dump', false);
  const [emailsInProgress, setEmailsInProgress] = useStickyState('AdminDatabaseDumpPage.email', false);

  const clickDump = () => {
    setDumpInProgress(true);
    dumpDatabaseMethod.call(null, (error, result) => {
      if (error) {
        setIsError(true);
      }
      setResults(result.collections);
      const zip = new ZipZap();
      const dir = 'radgrad-db';
      const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
      zip.file(fileName, JSON.stringify(result, null, 2));
      zip.saveAs(`${dir}.zip`);
      setDumpInProgress(false);
    });
  };

  const clickEmails = () => {
    setEmailsInProgress(true);
    generateStudentEmailsMethod.call(null, (error, result) => {
      if (error) {
        setIsError(true);
      }
      // console.log(error, result);
      const data: Collection = {};
      data.name = 'Students';
      data.contents = result.students;
      setResults([data]);
      const zip = new ZipZap();
      const now = moment().format(databaseFileDateFormat);
      const dir = `radgrad-students${now}`;
      const fileName = `${dir}/Students.txt`;
      zip.file(fileName, result.students.join('\n'));
      zip.saveAs(`${dir}.zip`);
      setEmailsInProgress(false);
    });
  };

  const errorCondition = isErrorState;
  const showMessage = resultsState.length > 0;
 
  return (
    <PageLayout id={PAGEIDS.DATABASE_DUMP_DATABASE} headerPaneTitle="Dump Database">
      <Form>
        <Button color="green" loading={dumpInProgress} basic type="submit" onClick={clickDump}>
          Dump Database
        </Button>
        <Button color="green" loading={emailsInProgress} basic type="submit" onClick={clickEmails}>
          Get Student Emails
        </Button>
      </Form>
      {showMessage ? (
        <Grid stackable style={{ paddingTop: '20px' }}>
          <Message positive={!errorCondition} error={errorCondition}>
            {resultsState.map((item, index) => (
              <AdminDatabaseAccordion key={item.name} index={index} name={item.name} contents={item.contents}/>
            ))}
          </Message>
        </Grid>
      ) : (
        ''
      )}
      <UploadFixture />
    </PageLayout>
  );
};

export default AdminDatabaseDumpPage;
