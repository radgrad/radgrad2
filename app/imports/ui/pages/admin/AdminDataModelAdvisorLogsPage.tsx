import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { Bert } from 'meteor/themeteorchef:bert';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  IAdminDataModelPageState,
  IAdvisorLog, IAdvisorLogUpdate,
  IDescriptionPair,
} from '../../../typings/radgrad';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';
import AddAdvisorLogFormContainer from '../../components/admin/AddAdvisorLogForm';

const descriptionPairs = (advisorLog: IAdvisorLog): IDescriptionPair[] => {
  return [
    { label: 'Advisor', value: `${Users.getFullName(advisorLog.advisorID)}` },
    { label: 'Student', value: `${Users.getFullName(advisorLog.studentID)}` },
    { label: 'Text', value: advisorLog.text },
  ];
};

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

const itemTitleString = (advisorLog: IAdvisorLog): string => {
  return `${name} ${advisorLog.createdOn}`;
};

class AdminDataModelAdvisorLogsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o ref=%o', inst, this.formRef);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    // console.log('handleUpdate(%o) ref=%o', doc, this.formRef);
    this.formRef.current.reset();
    this.setState({ showUpdateForm: false, id: '' });
    const collectionName = AdvisorLogs.getCollectionName();
    const updateData: IAdvisorLogUpdate = {};
    updateData.id = doc._id;
    updateData.text = doc.text;
    updateData.retired = doc.retired;
    console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` });
      } else {
        Bert.alert({ type: 'success', message: 'Update succeeded' });
      }
    });
  }

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    const collectionName = AdvisorLogs.getCollectionName();
    const instance = inst.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Delete failed: ${error.message}` });
      } else {
        Bert.alert({ type: 'success', message: 'Delete succeeded' });
        this.formRef.current.reset();
      }
    });
  }

  private handleCancel = (event) => {
    event.preventDefault();
    // console.log('formRef = %o', this.formRef);
    this.formRef.current.reset();
    this.setState({ showUpdateForm: false, id: '' });
  }

  private handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = AdvisorLogs.getCollectionName();
    const definitionData = doc;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
      } else {
        Bert.alert({ type: 'success', message: 'Add succeeded' });
        this.formRef.current.reset();
      }
    });
  }

  public render(): React.ReactNode {
    const paddedStyle = {
      paddingTop: 20,
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
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  handleOpenUpdate={this.handleOpenUpdate}
                                  handleDelete={this.handleDelete}
                                  setShowIndex={setCollectionShowIndex}
                                  setShowCount={setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }

}

export default AdminDataModelAdvisorLogsPage;
