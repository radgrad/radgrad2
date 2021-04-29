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
import UploadFixture from '../../components/admin/datamodel/UploadFixture';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
/** Annotated version of the Redux-based AdminDatabaseDump page. */

/** This is the type of the accordion that lists the contents of all collections after dump finishes. */
interface Collection {
  name?: string;
  contents?: string[];
}

/** Page Props. All for Redux. The connect() function at the bottom re-renders the page on changes. */
interface AdminDatabaseDumpPageProps {
  startDumpDatabase: () => any;
  dumpDatabaseDone: () => any;
  dumpDatabaseWorking?: boolean;
  startGetStudentEmails: () => any;
  getStudentEmailsDone: () => any;
  getStudentEmailsWorking?: boolean;
}

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/** The Redux convention for figure out which of the global state becomes available here. */
const mapStateToProps = (state: RootState) => ({
  dumpDatabaseWorking: state.admin.database.dumpDatabase,
  getStudentEmailsWorking: state.admin.analytics.newsletter.getStudentEmails,
});

/** The Redux dispatchers to set the global state when things happen on this page. */
const mapDispatchToProps = (dispatch) => ({
  startDumpDatabase: () => dispatch(databaseActions.startDumpDatabase()),
  dumpDatabaseDone: () => dispatch(databaseActions.dumpDatabaseDone()),
  startGetStudentEmails: () => dispatch(analyticsActions.startGetStudentEmails()),
  getStudentEmailsDone: () => dispatch(analyticsActions.getStudentEmailsDone()),
});

const AdminDatabaseDumpPage: React.FC<AdminDatabaseDumpPageProps> = ({ startDumpDatabase, dumpDatabaseDone, dumpDatabaseWorking, getStudentEmailsDone, getStudentEmailsWorking, startGetStudentEmails }) => {
  /** Local state for this page: did we get an error from either dumpDatabase or getEmails? */
  const [isErrorState, setIsError] = useState(false);
  /** Local state: do we have any results to display? */
  const [resultsState, setResults] = useState([]);

  const clickDump = () => {
    // Signal Redux that a dump database operation has started.
    startDumpDatabase();
    // Call the method. We should convert this to callPromise to make it easier to read.
    dumpDatabaseMethod.call(null, (error, result) => {
      if (error) {
        setIsError(true);
      }
      // Update our local state with the collection data returned from the method call.
      setResults(result.collections);
      // Now package it up and download it to the client's disk.
      const zip = new ZipZap();
      const dir = 'radgrad-db';
      const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
      zip.file(fileName, JSON.stringify(result, null, 2));
      zip.saveAs(`${dir}.zip`);
      // Signal Redux that the dump database operation is over.
      dumpDatabaseDone();
    });
  };

  const clickEmails = () => {
    // Signal Redux that we've started the emails.
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
      // Signal Redux that we've finished.
      getStudentEmailsDone();
    });
  };

  // We don't need the following line. :-)
  const errorCondition = isErrorState;
  // ResultsState is either a list of collections (from the database dump) or a list of emails (from the email sending)
  const showMessage = resultsState.length > 0;
  // Why these next two lines are here is beyond me.
  const dumpWorking = dumpDatabaseWorking;
  const getWorking = getStudentEmailsWorking;

  /** Now the actual rendering code. Note the following:
   *    * Both buttons display loading if the *Working variable is true.
   *    * If there are results (i.e. resultsState.length > 0, then display a simple accordion containing them.
   *    * Then there's a lonely UploadFixture component at the bottom who doesn't participate in any of this.
   */
  return (
    <PageLayout id={PAGEIDS.DATABASE_DUMP_DATABASE} headerPaneTitle="Dump Database">
      <Form>
        <Button color="green" loading={dumpWorking} basic type="submit" onClick={clickDump}>
          Dump Database
        </Button>
        <Button color="green" loading={getWorking} basic type="submit" onClick={clickEmails}>
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

/** Here's where we hook up Redux to this page and get it to re-render upon state changes. */
const AdminDatabaseDumpPageContainer = connect(mapStateToProps, mapDispatchToProps)(AdminDatabaseDumpPage);
export default AdminDatabaseDumpPageContainer;
