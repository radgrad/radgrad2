import * as React from 'react';
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Bert } from 'meteor/themeteorchef:bert';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoFields from 'uniforms-semantic/AutoFields';
import SubmitField from 'uniforms-semantic/SubmitField';
import { Users } from '../../../api/user/UserCollection';
import {
  IAdminDataModelPageState,
  IAdvisorLog, IAdvisorLogUpdate,
  IDescriptionPair,
} from '../../../typings/radgrad';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';

const descriptionPairs = (advisorLog: IAdvisorLog): IDescriptionPair[] => {
  return [
    { label: 'Advisor', value: `${Users.getFullName(advisorLog.advisorID)}` },
    { label: 'Student', value: `${Users.getFullName(advisorLog.studentID)}` },
    { label: 'Text', value: advisorLog.text },
  ];
};

const itemTitle = (advisorLog: IAdvisorLog): React.ReactNode => {
  const name = Users.getFullName(advisorLog.studentID);
  return (
    <React.Fragment>
      <Icon name="dropdown"/>
      {`${name} ${advisorLog.createdOn}`}
    </React.Fragment>
  );
};

class AdminDataModelAdvisorLogsPage extends React.Component<{}, IAdminDataModelPageState> {
  private formRef;

  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o ref=%o', inst, this.formRef);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate(doc) {
    // console.log('handleUpdate(%o) ref=%o', doc, this.formRef);
    this.formRef.current.reset();
    this.setState({ showUpdateForm: false, id: '' });
    const collectionName = AdvisorLogs.getCollectionName();
    const updateData: IAdvisorLogUpdate = {};
    updateData.id = doc._id;
    updateData.text = doc.text;
    // console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` });
      } else {
        Bert.alert({ type: 'success', message: 'Update succeeded' });
      }
    });
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
  }

  private handleCancel(event, instance) {
    event.preventDefault();
    // console.log('formRef = %o', this.formRef);
    this.formRef.current.reset();
    this.setState({ showUpdateForm: false, id: '' });
  }

  private handleAdd(doc) {
    console.log('handleAdd(%o)', doc);
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

          <Grid.Column width={4}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={12}>
            {this.state.showUpdateForm ? (
              <Segment padded={true}><Header dividing={true}>Update Advisor Log</Header><AutoForm
                ref={this.formRef}
                schema={AdvisorLogs.getUpdateSchema()} model={this.state.id ? AdvisorLogs.findDoc(this.state.id) : undefined}
                onSubmit={this.handleUpdate}><AutoFields/><SubmitField/><Button
                onClick={this.handleCancel}>Cancel</Button></AutoForm><p/></Segment>
            ) : (
              <Segment padded={true}><Header dividing={true}>Add Advisor Log</Header><AutoForm
                ref={this.formRef}
                onSubmit={this.handleAdd}
                schema={AdvisorLogs.getDefineSchema()}/></Segment>
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
