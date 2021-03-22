import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { StudentProfiles } from '../../../../app/imports/api/user/StudentProfileCollection';
import ListCollectionWidget from '../../../../app/imports/ui/components/admin/datamodel/ListCollectionWidget';
import { DescriptionPair, FeedbackInstanceDefine, StudentProfile, FeedbackInstance } from '../../../../app/imports/typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../../app/imports/api/base/BaseCollection.methods';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Users } from '../../../../app/imports/api/user/UserCollection';
import AddFeedbackInstanceForm from '../../component/admin/datamodel/feedback/AddFeedbackInstanceForm';
import UpdateFeedbackInstanceForm from '../../component/admin/datamodel/feedback/UpdateFeedbackInstanceForm';
import { profileNameToUsername } from '../../../../app/imports/ui/components/shared/utilities/data-model';
import { dataModelActions } from '../../../../app/imports/redux/admin/data-model';
import { getDatamodelCount } from '../../../../app/imports/ui/pages/admin/utilities/datamodel';
import PageLayout from '../../../../app/imports/ui/pages/PageLayout';

const collection = FeedbackInstances; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: FeedbackInstance): DescriptionPair[] => [
  { label: 'Student', value: Users.getFullName(item.userID) },
  { label: 'Function Name', value: item.functionName },
  { label: 'Description', value: item.description },
  { label: 'Type', value: item.feedbackType },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: FeedbackInstance): string => {
  const username = Users.getProfile(item.userID).username;
  const feedbackName = item.functionName;
  return `${username}-${feedbackName}`;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: FeedbackInstance): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelFeedbackInstancesPageProps  {
  items: FeedbackInstance[];
  students: StudentProfile[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelFeedbackInstancesPage: React.FC<AdminDataModelFeedbackInstancesPageProps> = (props) => {
  // TODO deconstruct props
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('FeedbackInstances.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData: FeedbackInstanceDefine = {
      user: profileNameToUsername(doc.user),
      functionName: doc.functionName,
      description: doc.description,
      feedbackType: doc.feedbackType,
      retired: doc.retired,
    };
    // console.log(collectionName, doc, definitionData);
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
        // @ts-ignore
        formRef.current.reset();
      }
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setShowUpdateForm(false);
    setId('');
    setConfirmOpen(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

  const handleConfirmDelete = () => {
    const collectionName = collection.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting AcademicTerm. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setShowUpdateForm(false);
      setId('');
      setConfirmOpen(false);
    });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    setShowUpdateForm(true);
    setId(inst.id);
  };

  const handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData: any = doc;
    updateData.id = doc._id;
    updateData.user = profileNameToUsername(doc.user);
    // console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        setShowUpdateForm(false);
        setId('');
      }
    });
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id="data-model-feedback-instances-page" headerPaneTitle="Feedback Instances">
      {showUpdateFormState ? (
        <UpdateFeedbackInstanceForm collection={collection} id={idState} formRef={formRef} handleUpdate={handleUpdate}
                                    handleCancel={handleCancel} itemTitleString={itemTitleString}
                                    students={props.students}/>
      ) : (
        <AddFeedbackInstanceForm formRef={formRef} handleAdd={handleAdd} students={props.students}/>
      )}
      <ListCollectionWidget
        collection={collection}
        findOptions={findOptions}
        descriptionPairs={descriptionPairs}
        itemTitle={itemTitle}
        handleOpenUpdate={handleOpenUpdate}
        handleDelete={handleDelete}
        setShowIndex={dataModelActions.setCollectionShowIndex}
        setShowCount={dataModelActions.setCollectionShowCount}
        items={props.items}
      />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete}
               header="Delete Feedback Instance?"/>
    </PageLayout>
  );
};

const AdminDataModelFeedbackInstancesPageContainer = withTracker(() => {
  const items = FeedbackInstances.find({}).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    students,
  };
})(AdminDataModelFeedbackInstancesPage);

export default AdminDataModelFeedbackInstancesPageContainer;
