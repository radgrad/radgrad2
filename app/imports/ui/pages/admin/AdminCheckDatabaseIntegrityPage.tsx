import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDatabaseMenuContainer from '../../components/admin/AdminDatabaseMenu';
import { checkIntegrity } from '../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../api/integrity/IntegrityChecker.methods';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { checkIntegrityDone, startCheckIntegrity } from '../../../redux/actions/actions';

interface IAdminCheckDatabaseIntegrityPageProps {
  startCheckIntegrity: () => any;
  checkIntegrityDone: () => any;
  checkIntegrityWorking?: boolean;
}
interface IAdminCheckDatabaseIntegrityPageState {
  clientResult?: {
    count: number;
    message: string;
  };
  serverResult?: {
    count: number;
    message: string;
  };
  checkIntegrityWorking?: boolean;
}

const mapStateToProps = (state) => {
  return {
    checkIntegrityWorking: state.radgradWorking.checkIntegrity,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startCheckIntegrity: () => dispatch(startCheckIntegrity()),
    checkIntegrityDone: () => dispatch(checkIntegrityDone()),
  };
};

class AdminCheckDatabaseIntegrityPage extends React.Component<IAdminCheckDatabaseIntegrityPageProps, IAdminCheckDatabaseIntegrityPageState> {
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
    this.props.startCheckIntegrity();
    checkIntegrityMethod.call(null, (error, result) => {
      if (error) {
        console.error('Error during integrity check:', error);
      } else {
        this.setState({ serverResult: result });
        this.props.checkIntegrityDone();
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
    const working = this.props.checkIntegrityWorking;
    // console.log('Check Integrity props=%o, state=%o working=%o', this.props, this.state, working);
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={5}>
            <AdminDatabaseMenuContainer/>
          </Grid.Column>

          <Grid.Column width={11}>
            <Form>
              <Button color="green" loading={working} basic={true} type="submit" onClick={this.clickSubmit}>Check Integrity</Button>
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

const AdminCheckDatabaseIntegrityPageContainer = connect(mapStateToProps, mapDispatchToProps)(AdminCheckDatabaseIntegrityPage);
export default AdminCheckDatabaseIntegrityPageContainer;
