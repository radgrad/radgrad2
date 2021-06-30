import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import RadGradAlert from '../../utilities/RadGradAlert';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { BaseProfile, DescriptionPair, Interest, Opportunity, OpportunityType, OpportunityUpdate } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import AddOpportunityForm from '../../components/admin/datamodel/opportunity/AddOpportunityForm';
import UpdateOpportunityForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityForm';
import { itemToSlugName, opportunityTypeNameToSlug, profileNameToUsername } from '../../components/shared/utilities/data-model';
import { interestSlugFromName } from '../../components/shared/utilities/form';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import { makeMarkdownLink } from './utilities/datamodel';
import PageLayout from '../PageLayout';

const collection = Opportunities; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Opportunity): DescriptionPair[] => {
  const retVal = [
    { label: 'Description', value: item.description },
    { label: 'Opportunity Type', value: OpportunityTypes.findDoc(item.opportunityTypeID).name },
    { label: 'Sponsor', value: Users.getProfile(item.sponsorID).username },
    { label: 'Interests', value: Interests.findNames(item.interestIDs).sort() },
    { label: 'ICE', value: `${item.ice.i}, ${item.ice.c}, ${item.ice.e}` },
    { label: 'Picture', value: makeMarkdownLink(item.picture) },
    { label: 'Retired', value: item.retired ? 'True' : 'False' },
  ];
  if (item.eventDate1 && item.eventDateLabel1) {
    retVal.push({ label: 'Event Date 1', value: `${item.eventDate1.toDateString()} ${item.eventDateLabel1}` });
  }
  if (item.eventDate2 && item.eventDateLabel2) {
    retVal.push({ label: 'Event Date 2', value: `${item.eventDate2.toDateString()} ${item.eventDateLabel2}` });
  }
  if (item.eventDate3 && item.eventDateLabel3) {
    retVal.push({ label: 'Event Date 3', value: `${item.eventDate3.toDateString()} ${item.eventDateLabel3}` });
  }
  if (item.eventDate4 && item.eventDateLabel4) {
    retVal.push({ label: 'Event Date 4', value: `${item.eventDate4.toDateString()} ${item.eventDateLabel4}` });
  }
  return retVal;
};

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Opportunity): string => (Opportunities.isDefined(item._id) ? `${item.name} (${itemToSlugName(item)})` : '');

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: Opportunity): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelOpportunitiesPageProps {
  items: Opportunity[];
  sponsors: BaseProfile[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}

const AdminDataModelOpportunitiesPage: React.FC<AdminDataModelOpportunitiesPageProps> = ({ items, interests,  opportunityTypes, sponsors }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('Opportunities.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData: OpportunityUpdate = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.opportunityType = opportunityTypeNameToSlug(doc.opportunityType);
    updateData.sponsor = profileNameToUsername(doc.sponsor);
    updateData.interests = doc.interests.map(interestSlugFromName);
    // console.log(collectionName, updateData);
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => {
        RadGradAlert.failure('Update Failed', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Update Succeeded');
        setShowUpdateForm(false);
        setId('');
      });
  };

  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_OPPORTUNITIES} headerPaneTitle="Opportunities">
      {showUpdateFormState ? (
        <UpdateOpportunityForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} sponsors={sponsors} interests={interests} opportunityTypes={opportunityTypes} />
      ) : (
        <AddOpportunityForm sponsors={sponsors} interests={interests} opportunityTypes={opportunityTypes} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Opportunity?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}).fetch();
  const advisors = AdvisorProfiles.find({}).fetch();
  const sponsorDocs = _.union(faculty, advisors);
  const sponsors = _.sortBy(sponsorDocs, ['lastName', 'firstName']);
  // We want to sort the items.
  const items = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const opportunityTypes = OpportunityTypes.find({}, { sort: { name: 1 } }).fetch();
  return {
    sponsors,
    items,
    interests,
    opportunityTypes,
  };
})(AdminDataModelOpportunitiesPage);
