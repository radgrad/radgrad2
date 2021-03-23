import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { AcademicTerm, DescriptionPair } from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/datamodel/AdminDataModelAddForm';
import { dataModelActions } from '../../../redux/admin/data-model';
import { getDatamodelCount } from './utilities/datamodel';
import PageLayout from '../PageLayout';

const numReferences = (term) => {
  let references = 0;
  [CourseInstances, OpportunityInstances].forEach((entity) => {
    entity.find().fetch().forEach((e) => {
      if (e.termID === term._id) {
        references++;
      }
    });
  });
  Opportunities.find().fetch().forEach((e) => {
    if (_.includes(e.termIDs, term._id)) {
      references++;
    }
  });
  return references;
};

const descriptionPairs = (term: AcademicTerm): DescriptionPair[] => ([
  { label: 'Term', value: AcademicTerms.toString(term._id, false) },
  { label: 'Term Number', value: `${term.termNumber}` },
  { label: 'References', value: `${numReferences(term)}` },
  { label: 'Retired', value: term.retired ? 'True' : 'False' },
]);

const itemTitle = (term: AcademicTerm): React.ReactNode => (
  <React.Fragment>
    {term.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {AcademicTerms.toString(term._id, false)}
  </React.Fragment>
);

const itemTitleString = (term) => AcademicTerms.toString(term._id, false);

interface AdminDataModelAcademicTermsPageProps {
  items: AcademicTerm[];
}

/**
 * AdminDataModelAcademicTermsPage.
 * @param props the Properties.
 * @constructor
 */
const AdminDataModelAcademicTermsPage: React.FC<AdminDataModelAcademicTermsPageProps> = (props) => {
  const formRef = null;
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = (event) => {
    event.preventDefault();
    setConfirmOpen(false);
    setId('');
    setShowUpdateForm(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

  const handleConfirmDelete = () => {
    const collectionName = AcademicTerms.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting AcademicTerm. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
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
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const updateData: { id?: string; retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating AcademicTerm. %o', error);
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
    sort: { termNumber: 1 },
  };
  return (
    <PageLayout id="data-model-academic-terms-page" headerPaneTitle="Academic Terms">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={AcademicTerms} id={idState} formRef={formRef} handleUpdate={handleUpdate}
                                  handleCancel={handleCancel} itemTitleString={itemTitleString} />
      ) : (
        <AdminDataModelAddForm collection={AcademicTerms} />
      )}
      <ListCollectionWidget
        collection={AcademicTerms}
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
               header="Delete Academic Term?" />
    </PageLayout>
  );
};

// TODO add the consts and a return.
const AdminDataModelAcademicTermsPageContainer = withTracker(() => {
  const items = AcademicTerms.find({}).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
  };
})(AdminDataModelAcademicTermsPage);

export default AdminDataModelAcademicTermsPageContainer;
