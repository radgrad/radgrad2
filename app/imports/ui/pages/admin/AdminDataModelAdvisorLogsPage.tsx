import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  IAcademicYear,
  IAdminDataModelPageState,
  IAdvisorLog,
  IAdvisorLogDefine,
  IDescriptionPair,
} from '../../../typings/radgrad';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';

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
    // do stuff.
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
  }

  private handleCancel(event, instance) {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
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
