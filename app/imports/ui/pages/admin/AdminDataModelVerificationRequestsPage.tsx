import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm'; // this should be replaced by specific UpdateForm
import { AcademicTerm, DescriptionPair, Opportunity, OpportunityInstance, StudentProfile, VerificationRequest } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddVerificationRequestForm from '../../components/admin/datamodel/verification-request/AddVerificationRequestForm';
import { academicTermNameToSlug, opportunityInstanceNameToId, opportunityInstanceNameToTermSlug, opportunityInstanceNameToUsername, opportunityNameToSlug, profileNameToUsername } from '../../components/shared/utilities/data-model';
import { getDatamodelCount } from './utilities/datamodel';
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

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelVerificationRequestsPage: React.FC<AdminDataModelVerificationRequestsPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('VerificationRequests.handleAdd()', doc);
    const collectionName = collection.getCollectionName();
    const definitionData: any = {};
    definitionData.status = doc.status;
    if (doc.opportunityInstance) {
      definitionData.opportunityInstance = opportunityInstanceNameToId(doc.opportunityInstance);
      definitionData.student = opportunityInstanceNameToUsername(doc.opportunityInstance);
      definitionData.academicTerm = opportunityInstanceNameToTermSlug(doc.opportunityInstance);
      // definitionData.academicTerm = AcademicTerms.
    } else {
      if (doc.student) {
        definitionData.student = profileNameToUsername(doc.student);
      }
      if (doc.opportunity) {
        definitionData.academicTerm = academicTermNameToSlug(doc.academicTerm);
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
      }
    }
    if (_.isBoolean(doc.retired)) {
      definitionData.retired = doc.retired;
    }
    // console.log(collectionName, definitionData);
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
    // console.log('VerificationRequests.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
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
    <PageLayout id="data-model-verification-requests-page" headerPaneTitle="Verification Requests">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={collection} id={idState} formRef={formRef} handleUpdate={handleUpdate}
                                  handleCancel={handleCancel} itemTitleString={itemTitleString}/>
      ) : (
        <AddVerificationRequestForm formRef={formRef} handleAdd={handleAdd} opportunities={props.opportunities}
                                    students={props.students} opportunityInstances={props.opportunityInstances}
                                    academicTerms={props.academicTerms}/>
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
               header="Delete Verification Request?"/>
    </PageLayout>
  );
};

const AdminDataModelVerificationRequestsPageContainer = withTracker(() => {
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const opportunityInstances = OpportunityInstances.find().fetch();
  const items = VerificationRequests.find({}).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    students,
    academicTerms,
    opportunities,
    opportunityInstances,
  };
})(AdminDataModelVerificationRequestsPage);

export default AdminDataModelVerificationRequestsPageContainer;
