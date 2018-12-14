import * as React from 'react';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenuContainer from '../../components/admin/AdminDatabaseMenu';
import { checkIntegrity } from '../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../api/integrity/IntegrityChecker.methods';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

interface IAdminCheckDatabaseIntegrityPageState {
  clientResult?: {
    count: number;
    message: string;
  };
  serverResult?: {
    count: number;
    message: string;
  };
}

/** A simple static component to render some text for the landing page. */
class AdminCheckDatabaseIntegrityPage extends React.Component<{}, IAdminCheckDatabaseIntegrityPageState> {
  constructor(props) {
    super(props);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.state = {
      clientResult: {
        count: 0,
        message: '',
      },
      serverResult: {
        count: 0,
        message: '',
      },
    };
  }

  private clickSubmit() {
    checkIntegrityMethod.call(null, (error, result) => {
      if (error) {
        console.log('Error during integrity check:', error);
      } else {
        this.setState({ serverResult: result });
      }
    });
    const clientResult = checkIntegrity();
    this.setState({ clientResult });
  }

  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    const showServer = !!this.state.serverResult.message;
    const serverError = this.state.serverResult.count !== 0;
    const showClient = !!this.state.clientResult.message;
    const clientError = this.state.clientResult.count !== 0;
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={5}>
            <AdminDatabaseMenuContainer/>
          </Grid.Column>

          <Grid.Column width={11}>
            <Form>
              <Button color="green" basic={true} type="submit" onClick={this.clickSubmit}>Check Integrity</Button>
            </Form>
            <Grid stackable={true} width="equal" style={paddedStyle}>
              <Grid.Column width={8}>
                {showClient ? (
                  <Message error={clientError} positive={!clientError}>
                    <Header> Integrity Check (Client-side DB)</Header>
                    <pre>{this.state.clientResult.message}</pre>
                  </Message>
                ) : ''}
              </Grid.Column>
              <Grid.Column width={8}>
                {showServer ? (
                  <Message error={serverError} positive={!serverError}>
                    <Header> Integrity Check (Server-side DB)</Header>
                    <pre>{this.state.serverResult.message}</pre>
                  </Message>
                ) : ''}
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminCheckDatabaseIntegrityPageContainer = withInstanceSubscriptions(withGlobalSubscription(AdminCheckDatabaseIntegrityPage));

export default AdminCheckDatabaseIntegrityPageContainer;
