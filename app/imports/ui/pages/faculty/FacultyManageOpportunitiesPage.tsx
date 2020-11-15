import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import ListOpportunitiesWidget from '../../components/faculty/manage-opportunities/FacultyListOpportunitiesWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { IDescriptionPair, IOpportunity } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddOpportunityForm from '../../components/admin/datamodel/opportunity/AddOpportunityForm';
import UpdateOpportunityForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityForm';
import {
  academicTermNameToSlug,
  opportunityTypeNameToSlug,
  profileNameToUsername,
} from '../../components/shared/utilities/data-model';
import { interestSlugFromName } from '../../components/shared/utilities/form';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

const collection = Opportunities; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: IOpportunity): IDescriptionPair[] => [
  { label: 'Description', value: item.description },
  { label: 'Opportunity Type', value: OpportunityTypes.findDoc(item.opportunityTypeID).name },
  { label: 'Sponsor', value: Users.getProfile(item.sponsorID).username },
  { label: 'Interests', value: _.sortBy(Interests.findNames(item.interestIDs)) },
  { label: 'Academic Terms', value: _.map(item.termIDs, (id: string) => AcademicTerms.toString(id, false)) },
  { label: 'ICE', value: `${item.ice.i}, ${item.ice.c}, ${item.ice.e}` },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => `${item.name}`;

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

const FacultyManageOpportunitesPage = () => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('Opportunities.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    const interests = _.map(doc.interests, interestSlugFromName);
    const terms = _.map(doc.terms, academicTermNameToSlug);
    definitionData.interests = interests;
    definitionData.terms = terms;
    definitionData.opportunityType = opportunityTypeNameToSlug(doc.opportunityType);
    definitionData.sponsor = profileNameToUsername(doc.sponsor);
    // console.log(definitionData);
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
    // console.log('Opportunities.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.opportunityType = opportunityTypeNameToSlug(doc.opportunityType);
    updateData.sponsor = profileNameToUsername(doc.sponsor);
    updateData.interests = _.map(doc.interests, interestSlugFromName);
    updateData.academicTerms = _.map(doc.terms, academicTermNameToSlug);
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
    <div id="faculty-manage-opportunities-page">
      <FacultyPageMenuWidget />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>
            {showUpdateFormState ? (
              <UpdateOpportunityForm
                collection={collection}
                id={idState}
                formRef={formRef}
                handleUpdate={handleUpdate}
                handleCancel={handleCancel}
                itemTitleString={itemTitleString}
              />
            ) : (
              <AddOpportunityForm formRef={formRef} handleAdd={handleAdd} />
            )}
            <ListOpportunitiesWidget
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
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
      <Confirm
        open={confirmOpenState}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        header="Delete Opportunity?"
      />

      <BackToTopButton />
    </div>
  );
};

export default FacultyManageOpportunitesPage;
