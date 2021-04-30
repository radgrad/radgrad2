import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import React, { useState } from 'react';
import { Button, Form, Grid, Message } from 'semantic-ui-react';
import { generateStudentEmailsMethod } from '../../../../api/user/UserCollection.methods';
import { databaseFileDateFormat } from '../../../pages/admin/AdminDatabaseManagementPage';
import { useStickyState } from '../../../utilities/StickyState';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';
import AdminDatabaseAccordion from './AdminDatabaseAccordion';

interface Collection {
  name?: string;
  contents?: string[];
}
const header = <RadGradHeader title='Dump Student Emails' icon='cloud download alternate' />;

const DumpStudentEmails: React.FC = () => {
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const [inProgress, setInProgress] = useStickyState('DumpStudentEmails', false);

  const onClick = () => {
    setInProgress(true);
    generateStudentEmailsMethod.callPromise(null)
      .catch(err => setError(true))
      .then(result => {
        const data: Collection = { name: 'Students', contents: result.students };
        setResults([data]);
        const zip = new ZipZap();
        const now = moment().format(databaseFileDateFormat);
        const dir = `radgrad-students-${now}`;
        const fileName = `${dir}/Students.txt`;
        zip.file(fileName, result.students.join('\n'));
        zip.saveAs(`${dir}.zip`);
      })
      .finally(() => setInProgress(false));
  };

  return (
    <RadGradSegment header={header}>
      <Form>
        <Button color="green" loading={inProgress} basic type="submit" onClick={onClick}>
          Dump Student Emails
        </Button>
        {results.length > 0 ? (
          <Grid stackable style={{ paddingTop: 20 }}>
            <Message positive={!error} error={error}>
              {results.map((item, index) => (
                <AdminDatabaseAccordion key={item.name} index={index} name={item.name} contents={item.contents}/>
              ))}
            </Message>
          </Grid>
        ) : (
          ''
        )}
      </Form>
    </RadGradSegment>
  );
};

export default DumpStudentEmails;
