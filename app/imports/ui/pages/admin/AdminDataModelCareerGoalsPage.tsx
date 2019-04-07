import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Icon } from 'semantic-ui-react';
import { Bert } from 'meteor/themeteorchef:bert';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  IAdminDataModelPageState,
  ICareerGoal, ICareerGoalUpdate,
  IDescriptionPair,
} from '../../../typings/radgrad';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import { Interests } from '../../../api/interest/InterestCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

function numReferences(careerGoal) {
  let references = 0;
  Users.findProfiles({}, {}).forEach((profile) => {
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      references += 1;
    }
  });
  return references;
}

const descriptionPairs = (careerGoal: ICareerGoal): IDescriptionPair[] => {
  return [
    { label: 'Description', value: careerGoal.description },
    { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
    { label: 'References', value: `Users: ${numReferences(careerGoal)}` },
  ];
};

const itemTitle = (careerGoal: ICareerGoal): React.ReactNode => {
  return (
    <React.Fragment>
      {careerGoal.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {`${careerGoal.name}`}
    </React.Fragment>
  );
};

class AdminDataModelCareerGoalsPage extends React.Component<{}, IAdminDataModelPageState> {
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
    const collectionName = CareerGoals.getCollectionName();
    const updateData: ICareerGoalUpdate = {};
    updateData.id = doc._id;
    updateData.name = doc.name;
    updateData.description = doc.description;
    updateData.retired = doc.retired;
    updateData.interests = doc.interests;
    console.log('updateData = %o', updateData);
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

  private handleCancel(event) {
    event.preventDefault();
    // console.log('formRef = %o', this.formRef);
    this.formRef.current.reset();
    this.setState({ showUpdateForm: false, id: '' });
  }

  private handleAdd(doc) {
    console.log('handleAdd(%o)', doc);
    const collectionName = CareerGoals.getCollectionName();
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
              <AdminDataModelUpdateForm collection={CareerGoals} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}/>
            ) : (
              <AdminDataModelAddForm collection={CareerGoals} formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <ListCollectionWidget collection={CareerGoals}
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

export default AdminDataModelCareerGoalsPage;
