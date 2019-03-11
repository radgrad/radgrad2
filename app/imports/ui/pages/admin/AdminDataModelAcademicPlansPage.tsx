import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListAcademicPlansWidget from '../../components/admin/ListAcademicPlansWidget';

class AdminDataModelAcademicPlansPage extends React.Component {
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={5}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={11}>
            <h1>Academic Plans</h1>
            {/*<ListAcademicPlansWidget/>*/}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminDataModelAcademicPlansPage;
