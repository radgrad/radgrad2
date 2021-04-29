import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';
import { checkIntegrity } from '../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../api/integrity/IntegrityChecker.methods';
import { databaseActions } from '../../../redux/admin/database';
import { RootState } from '../../../redux/types';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

interface AdminDatabaseCheckIntegrityPageProps {
  startCheckIntegrity: () => any;
  checkIntegrityDone: () => any;
  checkIntegrityWorking?: boolean;
}

const mapStateToProps = (state: RootState) => ({
  checkIntegrityWorking: state.admin.database.checkIntegrity,
});

const mapDispatchToProps = (dispatch) => ({
  startCheckIntegrity: () => dispatch(databaseActions.startCheckIntegrity()),
  checkIntegrityDone: () => dispatch(databaseActions.checkIntegrityDone()),
});

const AdminDatabaseCheckIntegrityPage: React.FC<AdminDatabaseCheckIntegrityPageProps> = ({ startCheckIntegrity, checkIntegrityDone, checkIntegrityWorking }) => {
  const initState = {
    count: 0,
    message: '',
  };
  const [clientResultState, setClientResult] = useState(initState);
  const [serverResultState, setServerResult] = useState(initState);

  const clickSubmit = () => {
    startCheckIntegrity();
    checkIntegrityMethod.call(null, (error, result) => {
      if (error) {
        console.error('Error during integrity check:', error);
      } else {
        setServerResult(result);
        checkIntegrityDone();
      }
    });
    const clientResult = checkIntegrity();
    setClientResult(clientResult);
  };

  const paddedStyle = {
    paddingTop: 20,
  };
  const showServer = !!serverResultState.message;
  const serverError = serverResultState.count !== 0;
  const showClient = !!clientResultState.message;
  const clientError = clientResultState.count !== 0;
  const working = checkIntegrityWorking;
  return (
    <PageLayout id={PAGEIDS.DATABASE_CHECK_INTEGRITY} headerPaneTitle="Check Integrity">
      <Form>
        <Button color="green" loading={working} basic type="submit" onClick={clickSubmit}>
          Check Integrity
        </Button>
      </Form>
      <Grid stackable width="equal" style={paddedStyle}>
        <Grid.Column width={8}>
          {showClient ? (
            <Message error={clientError} positive={!clientError}>
              <Header> Integrity Check (Client-side DB)</Header>
              <pre>{clientResultState.message}</pre>
            </Message>
          ) : (
            ''
          )}
        </Grid.Column>
        <Grid.Column width={8}>
          {showServer ? (
            <Message error={serverError} positive={!serverError}>
              <Header> Integrity Check (Server-side DB)</Header>
              <pre>{serverResultState.message}</pre>
            </Message>
          ) : (
            ''
          )}
        </Grid.Column>
      </Grid>
    </PageLayout>
  );
};

const AdminDatabaseCheckIntegrityPageContainer = connect(mapStateToProps, mapDispatchToProps)(AdminDatabaseCheckIntegrityPage);
export default AdminDatabaseCheckIntegrityPageContainer;
