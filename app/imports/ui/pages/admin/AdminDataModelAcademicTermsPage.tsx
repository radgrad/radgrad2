import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListAcademicTermsWidget from '../../components/admin/ListAcademicTermsWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import UpdateAcademicTermWidget from '../../components/admin/UpdateAcademicTermWidget';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IAdminDataModelAcademicTermsPageState {
  showUpdateForm: boolean;
  id: string;
}

class AdminDataModelAcademicTermsPage extends React.Component<{}, IAdminDataModelAcademicTermsPageState> {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
  }

  private handleUpdate(evt, inst) {
    evt.preventDefault();
    console.log('handleUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleDelete(event, instance) {
    event.preventDefault();
    console.log('handleDelete inst=%o', instance);
  }

  private handleCancel(event, instance) {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
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
            {this.state.showUpdateForm ? (<UpdateAcademicTermWidget model={AcademicTerms.findDoc(this.state.id)} handleCancel={this.handleCancel}/>) : ''}
            <ListAcademicTermsWidget handleUpdate={this.handleUpdate} handleDelete={this.handleDelete}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDataModelAcademicTermsPageContainer = withInstanceSubscriptions(withGlobalSubscription(AdminDataModelAcademicTermsPage));
export default AdminDataModelAcademicTermsPageContainer;
