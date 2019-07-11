import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';

class AdminDataModelPage extends React.Component {
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div className="layout-page">
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={13}>
            <Message floating={true} content={'Click on a data model element in the menu to the left to display those items.'}/>
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

export default withInstanceSubscriptions(withGlobalSubscription(AdminDataModelPage));
