import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstance, DescriptionPair, StudentProfile } from '../../../typings/radgrad';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AddAcademicYearInstanceFormContainer from '../../components/admin/datamodel/academic-year/AddAcademicYearInstanceForm';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { dataModelActions } from '../../../redux/admin/data-model';
import { getDatamodelCount } from './utilities/datamodel';
import PageLayout from '../PageLayout';

const descriptionPairs = (year: AcademicYearInstance): DescriptionPair[] => [
  { label: 'Student', value: Users.getFullName(year.studentID) },
  { label: 'Year', value: `${year.year}` },
  { label: 'Retired', value: year.retired ? 'True' : 'False' },
];

const itemTitle = (year: AcademicYearInstance): React.ReactNode => {
  const name = Users.getFullName(year.studentID);
  return (
    <React.Fragment>
      {year.retired ? <Icon name="eye slash" /> : ''}
      <Icon name="dropdown" />
      {`${name} ${year.year}`}
    </React.Fragment>
  );
};

const itemTitleString = (year: AcademicYearInstance): string => `${Users.getFullName(year.studentID)} ${year.year}`;

interface AdminDataModelAcademicYearsPageProps {
  items: AcademicYearInstance[];
  students: StudentProfile[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelAcademicYearsPage: React.FC<AdminDataModelAcademicYearsPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    const collectionName = AcademicYearInstances.getCollectionName();
    const definitionData = doc;
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
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting AcademicYearInstance. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setConfirmOpen(false);
      setId('');
    });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    setShowUpdateForm(true);
    setId(inst.id);
  };

  const handleUpdate = (doc) => {
    // console.log('handleUpdate(%o)', doc);
    const collectionName = AcademicYearInstances.getCollectionName();
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
        console.error('Error in updating AcademicYearInstance. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // @ts-ignore
        formRef.current.reset();
        setShowUpdateForm(false);
        setId('');
      }
    });
  };

  const findOptions = {
    sort: { year: 1 },
  };
  return (
    <PageLayout id="data-model-academic-year-instances-page" headerPaneTitle="Academic Year Instances">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={AcademicYearInstances} id={idState} formRef={formRef}
                                  handleUpdate={handleUpdate} handleCancel={handleCancel}
                                  itemTitleString={itemTitleString}/>
      ) : (
        <AddAcademicYearInstanceFormContainer formRef={formRef} handleAdd={handleAdd} students={props.students}/>
      )}
      <ListCollectionWidget
        collection={AcademicYearInstances}
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
               header="Delete Academic Year Instance?"/>
    </PageLayout>
  );
};

const AdminDataModelAcademicYearsPageContainer = withTracker(() => {
  const items = AcademicYearInstances.find({}).fetch();
  const students = StudentProfiles.find({ isAlumni: false }).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    students,
  };
})(AdminDataModelAcademicYearsPage);

export default AdminDataModelAcademicYearsPageContainer;
