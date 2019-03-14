import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';

class AdminDataModelPage extends React.Component {
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
            <Message floating={true} content={'Click on a data model element in the menu to the left to display those items.'}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDataModelPageContainer = withInstanceSubscriptions(withGlobalSubscription(AdminDataModelPage));
export default AdminDataModelPageContainer;
