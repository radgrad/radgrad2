import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
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
import { dataModelActions } from '../../../redux/admin/data-model';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper, updateCallBack,
} from './utilities/data-model-page-callbacks';
import { getDatamodelCount, makeMarkdownLink } from './utilities/datamodel';
import PageLayout from '../PageLayout';

const collection = Opportunities; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Opportunity): DescriptionPair[] => [
  { label: 'Description', value: item.description },
  { label: 'Opportunity Type', value: OpportunityTypes.findDoc(item.opportunityTypeID).name },
  { label: 'Sponsor', value: Users.getProfile(item.sponsorID).username },
  { label: 'Interests', value: _.sortBy(Interests.findNames(item.interestIDs)) },
  { label: 'Academic Terms', value: item.termIDs.map((id: string) => AcademicTerms.toString(id, false)) },
  { label: 'ICE', value: `${item.ice.i}, ${item.ice.c}, ${item.ice.e}` },
  { label: 'Picture', value: makeMarkdownLink(item.picture) },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

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

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelOpportunitiesPage: React.FC<AdminDataModelOpportunitiesPageProps> = (props) => {
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
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id="data-model-opportunities-page" headerPaneTitle="Opportunities">
      {showUpdateFormState ? (
        <UpdateOpportunityForm
          collection={collection}
          id={idState}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          itemTitleString={itemTitleString}
          sponsors={props.sponsors}
          terms={props.terms}
          interests={props.interests}
          opportunityTypes={props.opportunityTypes}
        />
      ) : (
        <AddOpportunityForm sponsors={props.sponsors} terms={props.terms}
                            interests={props.interests} opportunityTypes={props.opportunityTypes}/>
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
               header="Delete Opportunity?"/>
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
  const modelCount = getDatamodelCount();
  const opportunityTypes = OpportunityTypes.find({}).fetch();
  return {
    ...modelCount,
    sponsors,
    terms,
    items,
    interests,
    opportunityTypes,
  };
})(AdminDataModelOpportunitiesPage);

export default AdminDataModelOpportunitiesPageContainer;
