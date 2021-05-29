import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import RadGradAlerts from '../../utilities/RadGradAlert';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicTerm, BaseProfile, DescriptionPair, Interest, Opportunity, OpportunityType } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddOpportunityForm from '../../components/admin/datamodel/opportunity/AddOpportunityForm';
import UpdateOpportunityForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityForm';
import { academicTermNameToSlug, itemToSlugName, opportunityTypeNameToSlug, profileNameToUsername } from '../../components/shared/utilities/data-model';
import { interestSlugFromName } from '../../components/shared/utilities/form';
import { PAGEIDS } from '../../utilities/PageIDs';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from './utilities/data-model-page-callbacks';
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
    { label: 'Interests', value: _.sortBy(Interests.findNames(item.interestIDs)) },
    { label: 'Academic Terms', value: item.termIDs.map((id: string) => AcademicTerms.toString(id, false)) },
    { label: 'ICE', value: `${item.ice.i}, ${item.ice.c}, ${item.ice.e}` },
    { label: 'Picture', value: makeMarkdownLink(item.picture) },
    { label: 'Retired', value: item.retired ? 'True' : 'False' },
  ];
  if (item.eventDate) {
    retVal.push({ label: 'Event Date', value: item.eventDate.toDateString() });
  }
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
const itemTitleString = (item: Opportunity): string => `${item.name} (${itemToSlugName(item)})`;

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
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}

const AdminDataModelOpportunitiesPage: React.FC<AdminDataModelOpportunitiesPageProps> = ({ items, interests, terms, opportunityTypes, sponsors }) => {
  const RadGradAlert = new RadGradAlerts();
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
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.opportunityType = opportunityTypeNameToSlug(doc.opportunityType);
    updateData.sponsor = profileNameToUsername(doc.sponsor);
    updateData.interests = doc.interests.map(interestSlugFromName);
    updateData.academicTerms = doc.terms.map(academicTermNameToSlug);
    // console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, 2500, error);})
      .then(() => {
        RadGradAlert.success('Update Succeeded', '', 1500);
        setShowUpdateForm(false);
        setId('');
      });
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_OPPORTUNITIES} headerPaneTitle="Opportunities">
      {showUpdateFormState ? (
        <UpdateOpportunityForm
          collection={collection}
          id={idState}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          itemTitleString={itemTitleString}
          sponsors={sponsors}
          terms={terms}
          interests={interests}
          opportunityTypes={opportunityTypes}
        />
      ) : (
        <AddOpportunityForm sponsors={sponsors} terms={terms}
                            interests={interests} opportunityTypes={opportunityTypes} />
      )}
      <ListCollectionWidget
        collection={collection}
        findOptions={findOptions}
        descriptionPairs={descriptionPairs}
        itemTitle={itemTitle}
        handleOpenUpdate={handleOpenUpdate}
        handleDelete={handleDelete}
        items={items}
      />

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete}
               header="Delete Opportunity?" />
    </PageLayout>
  );
};

const AdminDataModelOpportunitiesPageContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  const after = currentTermNumber - 8;
  const before = currentTermNumber + 16;
  const allTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const terms = allTerms.filter((t) => t.termNumber >= after && t.termNumber <= before);
  const faculty = FacultyProfiles.find({}).fetch();
  const advisors = AdvisorProfiles.find({}).fetch();
  const sponsorDocs = _.union(faculty, advisors);
  const sponsors = _.sortBy(sponsorDocs, ['lastName', 'firstName']);
  const items = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const opportunityTypes = OpportunityTypes.find({}).fetch();
  return {
    sponsors,
    terms,
    items,
    interests,
    opportunityTypes,
  };
})(AdminDataModelOpportunitiesPage);

export default AdminDataModelOpportunitiesPageContainer;
