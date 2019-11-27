import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  IAdminDataModelPageState, // eslint-disable-line
  IAdvisorLog, IAdvisorLogUpdate, // eslint-disable-line
  IDescriptionPair, // eslint-disable-line
} from '../../../typings/radgrad';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AddAdvisorLogFormContainer from '../../components/admin/AddAdvisorLogForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';

const descriptionPairs = (advisorLog: IAdvisorLog): IDescriptionPair[] => [
    { label: 'Advisor', value: `${Users.getFullName(advisorLog.advisorID)}` },
    { label: 'Student', value: `${Users.getFullName(advisorLog.studentID)}` },
    { label: 'Text', value: advisorLog.text },
  ];

const itemTitle = (advisorLog: IAdvisorLog): React.ReactNode => {
  // console.log(advisorLog);
  const name = Users.getFullName(advisorLog.studentID);
  return (
    <React.Fragment>
      {advisorLog.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {`${name} ${advisorLog.createdOn}`}
    </React.Fragment>
  );
};

const itemTitleString = (advisorLog: IAdvisorLog): string => `${Users.getFullName(advisorLog.studentID)} ${advisorLog.createdOn}`;

class AdminDataModelAdvisorLogsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = AdvisorLogs.getCollectionName();
    const definitionData = doc;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
      }
    });
  }

  private handleCancel = (event) => {
    event.preventDefault();
    // console.log('formRef = %o', this.formRef);
    this.formRef.current.reset();
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  }

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    this.setState({ confirmOpen: true, id: inst.id });
  }

  private handleConfirmDelete = () => {
    // console.log('AcademicTerm.handleConfirmDelete state=%o', this.state);
    const collectionName = AdvisorLogs.getCollectionName();
    const instance = this.state.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // this.formRef.current.reset();
        this.setState({ id: '', confirmOpen: false });
      }
    });
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o ref=%o', inst, this.formRef);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    // console.log('handleUpdate(%o) ref=%o', doc, this.formRef);
    const collectionName = AdvisorLogs.getCollectionName();
    const updateData: IAdvisorLogUpdate = {};
    updateData.id = doc._id;
    updateData.text = doc.text;
    updateData.retired = doc.retired;
    // console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
        this.setState({ showUpdateForm: false, id: '' });
      }
    });
  }

  public render(): React.ReactNode {
    const paddedStyle = {
      paddingTop: 20,
    };
    const findOptions = {
      sort: { createdOn: 1 },
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <AdminDataModelUpdateForm collection={AdvisorLogs} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddAdvisorLogFormContainer formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={AdvisorLogs}
                                  findOptions={findOptions}
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  handleOpenUpdate={this.handleOpenUpdate}
                                  handleDelete={this.handleDelete}
                                  setShowIndex={dataModelActions.setCollectionShowIndex}
                                  setShowCount={dataModelActions.setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Advisor Log?"/>

        <BackToTopButton/>
      </div>
    );
  }

}

export default AdminDataModelAdvisorLogsPage;
