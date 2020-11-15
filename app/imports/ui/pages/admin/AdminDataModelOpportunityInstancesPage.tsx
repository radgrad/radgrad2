import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { IDescriptionPair } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import AddOpportunityInstanceForm from '../../components/admin/datamodel/opportunity/AddOpportunityInstanceForm';
import UpdateOpportunityInstanceForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityInstanceForm';
import {
  academicTermNameToDoc,
  opportunityNameToSlug,
  profileNameToUsername,
} from '../../components/shared/utilities/data-model';
import { Slugs } from '../../../api/slug/SlugCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const collection = OpportunityInstances; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: any): IDescriptionPair[] => [
  { label: 'Academic Term', value: AcademicTerms.toString(item.termID) },
  { label: 'Opportunity', value: (Opportunities.findDoc(item.opportunityID)).name },
  { label: 'Verified', value: item.verified ? 'True' : 'False' },
  { label: 'Student', value: Users.getFullName(item.studentID) },
  {
    label: 'ICE', value: item.ice ? `${item.ice.i}, ${item.ice.c}, 
        ${item.ice.e}` : '',
  },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => {
  const oppName = Opportunities.findDoc(item.opportunityID).name;
  const username = Users.getProfile(item.studentID).username;
  const semester = AcademicTerms.toString(item.termID, true);
  return `${username}-${oppName}-${semester}`;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

const AdminDataModelOpportunityInstancesPage = () => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('OpportunityInstances.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    const academicTermDoc = academicTermNameToDoc(doc.term);
    const academicTerm = Slugs.getNameFromID(academicTermDoc.slugID);
    const opportunity = opportunityNameToSlug(doc.opportunity);
    const student = profileNameToUsername(doc.student);
    const sponsor = profileNameToUsername(doc.sponsor);
    definitionData.academicTerm = academicTerm;
    definitionData.opportunity = opportunity;
    definitionData.sponsor = sponsor;
    definitionData.student = student;
    if (_.isBoolean(doc.verified)) {
      definitionData.verifed = doc.verifed;
    }
    if (_.isBoolean(doc.retired)) {
      definitionData.retired = doc.retired;
    }
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
        console.error('Error deleting. %o', error);
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
    // console.log('OpportunityInstances.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.termID = academicTermNameToDoc(doc.academicTerm)._id;
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

  const paddedStyle = {
    paddingTop: 20,
  };
  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <div id="data-model-opportunity-instances-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateOpportunityInstanceForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AddOpportunityInstanceForm formRef={formRef} handleAdd={handleAdd} />
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
          />
        </Grid.Column>
      </Grid>
      <Confirm
        open={confirmOpenState}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        header="Delete Opportunity Instance?"
      />

      <BackToTopButton />
    </div>
  );
};

export default withInstanceSubscriptions(AdminDataModelOpportunityInstancesPage);
