import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListAcademicTermsWidget from '../../components/admin/ListAcademicTermsWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

class AdminDataModelAcademicTermsPage extends React.Component<{}, {}> {
  constructor(props, state) {
    super(props, state);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  private handleUpdate(evt, inst) {
    evt.preventDefault();
    console.log('handleUpdate inst=%o', evt, inst);
  }

  private handleDelete(event, instance) {
    event.preventDefault();
    console.log('handleDelete inst=%o', instance);
  }
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
            <h1>Academic Terms</h1>
            <ListAcademicTermsWidget handleUpdate={this.handleUpdate} handleDelete={this.handleDelete}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDataModelAcademicTermsPageContainer = withInstanceSubscriptions(withGlobalSubscription(AdminDataModelAcademicTermsPage));
export default AdminDataModelAcademicTermsPageContainer;
