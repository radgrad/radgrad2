import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstance, DescriptionPair, StudentProfile } from '../../../typings/radgrad';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AddAcademicYearInstanceForm from '../../components/admin/datamodel/academic-year/AddAcademicYearInstanceForm';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { dataModelActions } from '../../../redux/admin/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper, updateCallBack,
} from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = AcademicYearInstances;

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

/**
 * AdminDataModelAcademicYearsPage.
 * @param {AcademicYearInstance[]} items
 * @param {StudentProfile[]} students
 * @return {JSX.Element}
 * @constructor
 */
const AdminDataModelAcademicYearsPage: React.FC<AdminDataModelAcademicYearsPageProps> = ({ items, students }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('handleUpdate(%o)', doc);
    const collectionName = collection.getCollectionName();
    const updateData: { id?: string; year?: number; retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.year = doc.year;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const findOptions = {
    sort: { year: 1 },
  };
  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_ACADEMIC_YEARS} headerPaneTitle="Academic Year Instances">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={AcademicYearInstances} id={idState}
                                  handleUpdate={handleUpdate} handleCancel={handleCancel}
                                  itemTitleString={itemTitleString}/>
      ) : (
        <AddAcademicYearInstanceForm students={students}/>
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
        items={items}
      />

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete}
               header="Delete Academic Year Instance?"/>
    </PageLayout>
  );
};

const AdminDataModelAcademicYearsPageContainer = withTracker(() => {
  const items = AcademicYearInstances.find({}).fetch();
  const students = StudentProfiles.find({ isAlumni: false }).fetch();
  return {
    items,
    students,
  };
})(AdminDataModelAcademicYearsPage);

export default AdminDataModelAcademicYearsPageContainer;
