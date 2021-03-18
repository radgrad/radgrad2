import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicTerm, BaseProfile, DescriptionPair, Interest, Opportunity, OpportunityType } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
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
  // TODO deconstruct props
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('Opportunities.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    const interests = doc.interests.map(interestSlugFromName);
    const terms = doc.terms.map(academicTermNameToSlug);
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
    updateData.interests = doc.interests.map(interestSlugFromName);
    updateData.academicTerms = doc.terms.map(academicTermNameToSlug);
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
    <PageLayout id="data-model-opportunities-page" headerPaneTitle="Opportunities">
      {showUpdateFormState ? (
        <UpdateOpportunityForm
          collection={collection}
          id={idState}
          formRef={formRef}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          itemTitleString={itemTitleString}
          sponsors={props.sponsors}
          terms={props.terms}
          interests={props.interests}
          opportunityTypes={props.opportunityTypes}
        />
      ) : (
        <AddOpportunityForm formRef={formRef} handleAdd={handleAdd} sponsors={props.sponsors} terms={props.terms}
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
