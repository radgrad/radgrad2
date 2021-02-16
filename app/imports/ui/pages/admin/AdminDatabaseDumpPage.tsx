import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Message } from 'semantic-ui-react';
import moment from 'moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { dumpDatabaseMethod } from '../../../api/base/BaseCollection.methods';
import { generateStudentEmailsMethod } from '../../../api/user/UserCollection.methods';
import AdminDatabaseAccordion from '../../components/admin/database/AdminDatabaseAccordion';
import { databaseActions } from '../../../redux/admin/database';
import { analyticsActions } from '../../../redux/admin/analytics';
import { RootState } from '../../../redux/types';
import PageLayout from '../PageLayout';

interface Collection {
  name?: string;
  contents?: string[];
}

interface AdminDatabaseDumpPageProps {
  startDumpDatabase: () => any;
  dumpDatabaseDone: () => any;
  dumpDatabaseWorking?: boolean;
  startGetStudentEmails: () => any;
  getStudentEmailsDone: () => any;
  getStudentEmailsWorking?: boolean;
}

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const mapStateToProps = (state: RootState) => ({
  dumpDatabaseWorking: state.admin.database.dumpDatabase,
  getStudentEmailsWorking: state.admin.analytics.newsletter.getStudentEmails,
});

const mapDispatchToProps = (dispatch) => ({
  startDumpDatabase: () => dispatch(databaseActions.startDumpDatabase()),
  dumpDatabaseDone: () => dispatch(databaseActions.dumpDatabaseDone()),
  startGetStudentEmails: () => dispatch(analyticsActions.startGetStudentEmails()),
  getStudentEmailsDone: () => dispatch(analyticsActions.getStudentEmailsDone()),
});

const AdminDatabaseDumpPage: React.FC<AdminDatabaseDumpPageProps> = ({ startDumpDatabase, dumpDatabaseDone, dumpDatabaseWorking, getStudentEmailsDone, getStudentEmailsWorking, startGetStudentEmails }) => {
  const [isErrorState, setIsError] = useState(false);
  const [resultsState, setResults] = useState([]);

  const clickDump = () => {
    startDumpDatabase();
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
      dumpDatabaseDone();
    });
  };

  const clickEmails = () => {
    startGetStudentEmails();
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
      getStudentEmailsDone();
    });
  };

  const errorCondition = isErrorState;
  const showMessage = resultsState.length > 0;
  const dumpWorking = dumpDatabaseWorking;
  const getWorking = getStudentEmailsWorking;
  return (
    <PageLayout id="database-dump-database-page" headerPaneTitle="Dump Database">
      <Form>
        <Button color="green" loading={dumpWorking} basic type="submit" onClick={clickDump}>
          Dump Database
        </Button>
        <Button color="green" loading={getWorking} basic type="submit" onClick={clickEmails}>
          Get Student Emails
        </Button>
      </Form>
      {showMessage ? (
        <Grid stackable style={{paddingTop: '20px'}}>
          <Message positive={!errorCondition} error={errorCondition}>
            {resultsState.map((item, index) => (
              <AdminDatabaseAccordion key={item.name} index={index} name={item.name} contents={item.contents}/>
            ))}
          </Message>
        </Grid>
      ) : (
        ''
      )}
    </PageLayout>
  );
};

const AdminDatabaseDumpPageContainer = connect(mapStateToProps, mapDispatchToProps)(AdminDatabaseDumpPage);
export default AdminDatabaseDumpPageContainer;