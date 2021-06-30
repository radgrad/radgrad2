import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import RadGradAlert from '../../utilities/RadGradAlert';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicTerm, BaseProfile, DescriptionPair, Opportunity, OpportunityInstance, StudentProfile } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import AddOpportunityInstanceForm from '../../components/admin/datamodel/opportunity/AddOpportunityInstanceForm';
import UpdateOpportunityInstanceForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityInstanceForm';
import { academicTermNameToDoc } from '../../components/shared/utilities/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = OpportunityInstances; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: OpportunityInstance): DescriptionPair[] => [
  { label: 'Academic Term', value: AcademicTerms.toString(item.termID) },
  { label: 'Opportunity', value: Opportunities.findDoc(item.opportunityID).name },
  { label: 'Verified', value: item.verified ? 'True' : 'False' },
  { label: 'Student', value: Users.getFullName(item.studentID) },
  {
    label: 'ICE',
    value: item.ice
      ? `${item.ice.i}, ${item.ice.c}, 
        ${item.ice.e}`
      : '',
  },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: OpportunityInstance): string => {
  if (OpportunityInstances.isDefined(item._id)) {
    const oppName = Opportunities.findDoc(item.opportunityID).name;
    // console.log('itemTitleString');
    const username = Users.getProfile(item.studentID).username;
    const semester = AcademicTerms.toString(item.termID, true);
    return `${username}-${oppName}-${semester}`;
  }
  return '';
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: OpportunityInstance): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelOpportunityInstancesPageProps {
  items: OpportunityInstance[];
  terms: AcademicTerm[];
  opportunities: Opportunity[];
  students: StudentProfile[];
  sponsors: BaseProfile[];
}

const AdminDataModelOpportunityInstancesPage: React.FC<AdminDataModelOpportunityInstancesPageProps> = ({ items, sponsors, terms, opportunities, students }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('OpportunityInstances.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.termID = academicTermNameToDoc(doc.academicTerm)._id;
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
    <PageLayout id={PAGEIDS.DATA_MODEL_OPPORTUNITY_INSTANCES} headerPaneTitle="Opportunity Instances">
      {showUpdateFormState ? (
        <UpdateOpportunityInstanceForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} terms={terms} />
      ) : (
        <AddOpportunityInstanceForm opportunities={opportunities} sponsors={sponsors} students={students} terms={terms} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Opportunity Instance?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}).fetch();
  const advisors = AdvisorProfiles.find({}).fetch();
  const sponsorDocs = _.union(faculty, advisors);
  const sponsors = _.sortBy(sponsorDocs, ['lastName', 'firstName']);
  const items = OpportunityInstances.find({}).fetch();
  return {
    items,
    terms,
    opportunities,
    students,
    sponsors,
  };
})(AdminDataModelOpportunityInstancesPage);
