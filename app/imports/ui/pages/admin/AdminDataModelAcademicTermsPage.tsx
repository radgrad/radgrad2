import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import RadGradAlert from '../../utilities/RadGradAlert';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerm, DescriptionPair } from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/datamodel/AdminDataModelAddForm';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = AcademicTerms;

const numReferences = (term) => {
  let references = 0;
  [CourseInstances, OpportunityInstances].forEach((entity) => {
    entity
      .find()
      .fetch()
      .forEach((e) => {
        if (e.termID === term._id) {
          references++;
        }
      });
  });
  return references;
};

const descriptionPairs = (term: AcademicTerm): DescriptionPair[] => [
  { label: 'Term', value: AcademicTerms.toString(term._id, false) },
  { label: 'Term Number', value: `${term.termNumber}` },
  { label: 'References', value: `${numReferences(term)}` },
  { label: 'Retired', value: term.retired ? 'True' : 'False' },
];

const itemTitle = (term: AcademicTerm): React.ReactNode => {
  if (AcademicTerms.isDefined(term._id)) {
    return (
      <React.Fragment>
        {term.retired ? <Icon name="eye slash" /> : ''}
        <Icon name="dropdown" />
        {AcademicTerms.toString(term._id, false)}
      </React.Fragment>
    );
  }
  return <React.Fragment />;
};

const itemTitleString = (term) => AcademicTerms.toString(term._id, false);

interface AdminDataModelAcademicTermsPageProps {
  items: AcademicTerm[];
}

/**
 * AdminDataModelAcademicTermsPage.
 * @param {AcademicTerm[]} items
 * @return {JSX.Element}
 * @memberOf ui/pages/admin
 * @constructor
 */
const AdminDataModelAcademicTermsPage: React.FC<AdminDataModelAcademicTermsPageProps> = ({ items }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData: { id?: string; retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
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
    <PageLayout id={PAGEIDS.DATA_MODEL_ACADEMIC_TERMS} headerPaneTitle="Academic Terms">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={AcademicTerms} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} />
      ) : (
        <AdminDataModelAddForm collection={AcademicTerms} />
      )}
      <ListCollectionWidget collection={AcademicTerms} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Academic Term?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  // We want to sort the items.
  const items = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    items,
  };
})(AdminDataModelAcademicTermsPage);
