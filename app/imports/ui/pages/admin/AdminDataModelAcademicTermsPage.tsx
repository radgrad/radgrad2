import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListAcademicTermsWidget from '../../components/admin/ListAcademicTermsWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import UpdateAcademicTermWidget from '../../components/admin/UpdateAcademicTermWidget';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';

interface IAdminDataModelAcademicTermsPageState {
  showUpdateForm: boolean;
  id: string;
}

class AdminDataModelAcademicTermsPage extends React.Component<{}, IAdminDataModelAcademicTermsPageState> {
  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate(doc) {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const updateData: { id?: string, retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error('Error in updating AcademicTerm. %o', error);
      }
      this.setState({ showUpdateForm: false, id: '' });
    });
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
    const collectionName = AcademicTerms.getCollectionName();
    const instance = inst.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error('Error deleting AcademicTerm. %o', error);
      }
    });
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
            {this.state.showUpdateForm ? (<UpdateAcademicTermWidget model={AcademicTerms.findDoc(this.state.id)}
                                                                    handleCancel={this.handleCancel}
                                                                    handleUpdate={this.handleUpdate}/>) : ''}
            <ListAcademicTermsWidget handleOpenUpdate={this.handleOpenUpdate} handleDelete={this.handleDelete}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdminDataModelAcademicTermsPageContainer = withInstanceSubscriptions(withGlobalSubscription(AdminDataModelAcademicTermsPage));
export default AdminDataModelAcademicTermsPageContainer;
