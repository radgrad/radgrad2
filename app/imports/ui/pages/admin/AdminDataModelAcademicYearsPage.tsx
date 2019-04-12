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
import AddAcademicYearInstanceFormContainer from '../../components/admin/AddAcademicYearInstanceForm';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Bert } from "meteor/themeteorchef:bert";

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

const itemTitleString = (year: IAcademicYear): string => {
  return `${name} ${year.year}`;
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
    console.log('handleUpdate(%o)', doc);
    const collectionName = AcademicYearInstances.getCollectionName();
    const updateData: { id?: string, retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` });
        console.error('Error in updating AcademicYearInstance. %o', error);
      } else {
        Bert.alert({ type: 'success', message: 'Update succeeded' });
      }
      this.setState({ showUpdateForm: false, id: '' });
    });
  }

  private handleAdd(doc) {
    console.log('handleAdd(%o)', doc);
    const collectionName = AcademicYearInstances.getCollectionName();
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
