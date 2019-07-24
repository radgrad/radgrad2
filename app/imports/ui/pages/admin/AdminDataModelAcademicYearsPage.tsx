import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { IAcademicYear, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AddAcademicYearInstanceFormContainer from '../../components/admin/AddAcademicYearInstanceForm';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { setCollectionShowIndex, setCollectionShowCount } from '../../../redux/admin/data-model/actions';

const descriptionPairs = (year: IAcademicYear): IDescriptionPair[] => [
    { label: 'Student', value: Users.getFullName(year.studentID) },
    { label: 'Year', value: `${year.year}` },
  ];

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

const itemTitleString = (year: IAcademicYear): string => `${Users.getFullName(year.studentID)} ${year.year}`;

class AdminDataModelAcademicYearsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = AcademicYearInstances.getCollectionName();
    const definitionData = doc;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.formRef.current.reset();
      }
    });
  }

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  }

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    this.setState({ confirmOpen: true, id: inst.id });
  }

  private handleConfirmDelete = () => {
    // console.log('AcademicTerm.handleConfirmDelete state=%o', this.state);
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = this.state.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error deleting AcademicYearInstance. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.setState({ confirmOpen: false, id: '' });
    });
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    // console.log('handleUpdate(%o)', doc);
    const collectionName = AcademicYearInstances.getCollectionName();
    const updateData: { id?: string, retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating AcademicYearInstance. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
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
      sort: { year: 1 },
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
              <AdminDataModelUpdateForm collection={AcademicYearInstances} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddAcademicYearInstanceFormContainer formRef={this.formRef}
                                                    handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={AcademicYearInstances}
                                  findOptions={findOptions}
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  handleOpenUpdate={this.handleOpenUpdate}
                                  handleDelete={this.handleDelete}
                                  setShowIndex={setCollectionShowIndex}
                                  setShowCount={setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Academic Year Instance?"/>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdminDataModelAcademicYearsPage;
