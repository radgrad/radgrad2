import React from 'react';
import _ from 'lodash';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  IAdminDataModelPageState, // eslint-disable-line
  ICareerGoal, ICareerGoalUpdate, // eslint-disable-line
  IDescriptionPair, // eslint-disable-line
} from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AddCareerGoalForm from '../../components/admin/AddCareerGoalForm';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { profileGetCareerGoalIDs, itemToSlugName } from '../../components/shared/data-model-helper-functions';

function numReferences(careerGoal) {
  let references = 0;
  Users.findProfiles({}, {}).forEach((profile) => {
    if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
      references += 1;
    }
  });
  return references;
}

const descriptionPairs = (careerGoal: ICareerGoal): IDescriptionPair[] => [
    { label: 'Description', value: careerGoal.description },
    { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
    { label: 'References', value: `Users: ${numReferences(careerGoal)}` },
  ];

const itemTitleString = (careerGoal: ICareerGoal): string => `${careerGoal.name} (${itemToSlugName(careerGoal)})`;

const itemTitle = (careerGoal: ICareerGoal): React.ReactNode => (
  <React.Fragment>
    {careerGoal.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(careerGoal)}
  </React.Fragment>
  );

class AdminDataModelCareerGoalsPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = CareerGoals.getCollectionName();
    const interests = doc.interests;
    const slugs = _.map(interests, (i) => Slugs.getNameFromID(Interests.findDoc({ name: i }).slugID));
    const definitionData = doc;
    definitionData.interests = slugs;
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
    const collectionName = CareerGoals.getCollectionName();
    const instance = this.state.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting CareerGoal. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.setState({ confirmOpen: false, id: '' });
    });
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o ref=%o', inst, this.formRef);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    // console.log('handleUpdate(%o) ref=%o', doc, this.formRef);
    const collectionName = CareerGoals.getCollectionName();
    const updateData: ICareerGoalUpdate = {};
    updateData.id = doc._id;
    updateData.name = doc.name;
    updateData.description = doc.description;
    updateData.retired = doc.retired;
    updateData.interests = doc.interests;
    // console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Update failed', error);
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
    return (
      <div>
        <AdminPageMenuWidget />
        <Grid container stackable style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu />
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <AdminDataModelUpdateForm
                collection={CareerGoals}
                id={this.state.id}
                formRef={this.formRef}
                handleUpdate={this.handleUpdate}
                handleCancel={this.handleCancel}
                itemTitleString={itemTitleString}
              />
            ) : (
              <AddCareerGoalForm collection={CareerGoals} formRef={this.formRef} handleAdd={this.handleAdd} />
            )}
            <ListCollectionWidget
              collection={CareerGoals}
              descriptionPairs={descriptionPairs}
              itemTitle={itemTitle}
              handleOpenUpdate={this.handleOpenUpdate}
              handleDelete={this.handleDelete}
              setShowIndex={dataModelActions.setCollectionShowIndex}
              setShowCount={dataModelActions.setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Career Goal?" />

        <BackToTopButton />
      </div>
    );
  }

}

export default AdminDataModelCareerGoalsPage;
