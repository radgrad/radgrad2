import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm'; // this should be replaced by specific UpdateForm
import { AcademicTerm, DescriptionPair, Opportunity, OpportunityInstance, StudentProfile, VerificationRequest } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddVerificationRequestForm from '../../components/admin/datamodel/verification-request/AddVerificationRequestForm';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = VerificationRequests; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: VerificationRequest): DescriptionPair[] => [
  { label: 'Student', value: `${Users.getFullName(item.studentID)}` },
  {
    label: 'Opportunity',
    value: `${OpportunityInstances.getOpportunityDoc(item.opportunityInstanceID).name}`,
  },
  { label: 'Submitted on', value: item.submittedOn.toString() },
  { label: 'Status', value: item.status },
  { label: 'ICE', value: `${item.ice.i}, ${item.ice.c}, ${item.ice.e}` },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: VerificationRequest): string => {
  const student = Users.getFullName(item.studentID);
  const oi = OpportunityInstances.findDoc(item.opportunityInstanceID);
  const term = AcademicTerms.toString(oi.termID, false);
  const opportunityName = OpportunityInstances.getOpportunityDoc(item.opportunityInstanceID).name;
  return `${student}: ${opportunityName} - ${term}`;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: VerificationRequest): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelVerificationRequestsPageProps {
  items: VerificationRequest[];
  students: StudentProfile[];
  academicTerms: AcademicTerm[];
  opportunities: Opportunity[];
  opportunityInstances: OpportunityInstance[];
}

const AdminDataModelVerificationRequestsPage: React.FC<AdminDataModelVerificationRequestsPageProps> = ({ items, academicTerms, students, opportunities, opportunityInstances }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('VerificationRequests.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateMethod.callPromise({ collectionName, updateData });
  };

  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_VERIFICATION_REQUESTS} headerPaneTitle="Verification Requests">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} />
      ) : (
        <AddVerificationRequestForm opportunities={opportunities} students={students} opportunityInstances={opportunityInstances} academicTerms={academicTerms} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Verification Request?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const opportunityInstances = OpportunityInstances.find().fetch();
  const items = VerificationRequests.find({}).fetch();
  return {
    items,
    students,
    academicTerms,
    opportunities,
    opportunityInstances,
  };
})(AdminDataModelVerificationRequestsPage);
