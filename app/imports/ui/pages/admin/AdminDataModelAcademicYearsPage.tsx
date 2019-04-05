import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { IAcademicYear, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';

const descriptionPairs = (year: IAcademicYear): IDescriptionPair[] => {
  return [
    { label: 'Student', value: Users.getFullName(year.studentID) },
    { label: 'Year', value: `${year.year}` },
  ];
};

const itemTitle = (year: IAcademicYear): React.ReactNode => {
  const name = Users.getFullName(year.studentID);
  return (
    <React.Fragment>
      {year.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {`${name} ${year.year}`}
    </React.Fragment>
  );
};

class AdminDataModelAcademicYearsPage extends React.Component<{}, IAdminDataModelPageState> {
  private formRef;

  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate(doc) {
    // do stuff.
  }

  private handleAdd(doc) {
    // do stuff.
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
  }

  private handleCancel(event) {
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
            {this.state.showUpdateForm ? (
              <AdminDataModelUpdateForm collection={AcademicYearInstances} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}/>
            ) : (
              <AdminDataModelAddForm collection={AcademicYearInstances} formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={AcademicYearInstances}
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

export default AdminDataModelAcademicYearsPage;
