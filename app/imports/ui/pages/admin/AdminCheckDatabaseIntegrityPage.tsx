import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenuContainer from '../../components/admin/database/AdminDatabaseMenu';
import { checkIntegrity } from '../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../api/integrity/IntegrityChecker.methods';
import { databaseActions } from '../../../redux/admin/database';
import { RootState } from '../../../redux/types';

interface AdminCheckDatabaseIntegrityPageProps {
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

const AdminCheckDatabaseIntegrityPage: React.FC<AdminCheckDatabaseIntegrityPageProps> = ({ startCheckIntegrity, checkIntegrityDone, checkIntegrityWorking }) => {
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
    <div>
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={5}>
          <AdminDatabaseMenuContainer />
        </Grid.Column>

        <Grid.Column width={11}>
          <Form>
            <Button color="green" loading={working} basic type="submit" onClick={clickSubmit}>Check Integrity</Button>
          </Form>
          <Grid stackable width="equal" style={paddedStyle}>
            <Grid.Column width={8}>
              {showClient ? (
                <Message error={clientError} positive={!clientError}>
                  <Header> Integrity Check (Client-side DB)</Header>
                  <pre>{clientResultState.message}</pre>
                </Message>
              ) : ''}
            </Grid.Column>
            <Grid.Column width={8}>
              {showServer ? (
                <Message error={serverError} positive={!serverError}>
                  <Header> Integrity Check (Server-side DB)</Header>
                  <pre>{serverResultState.message}</pre>
                </Message>
              ) : ''}
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const AdminCheckDatabaseIntegrityPageContainer = connect(mapStateToProps, mapDispatchToProps)(AdminCheckDatabaseIntegrityPage);
export default AdminCheckDatabaseIntegrityPageContainer;
