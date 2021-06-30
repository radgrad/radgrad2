import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import RadGradAlert from '../../utilities/RadGradAlert';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicTerm, Course, CourseInstance, DescriptionPair, StudentProfile } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Users } from '../../../api/user/UserCollection';
import AddCourseInstanceForm from '../../components/admin/datamodel/course/AddCourseInstanceForm';
import { academicTermNameToDoc } from '../../components/shared/utilities/data-model';
import UpdateCourseInstanceForm from '../../components/admin/datamodel/course/UpdateCourseInstanceForm';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = CourseInstances;

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: CourseInstance): DescriptionPair[] => [
  { label: 'Academic Term', value: AcademicTerms.toString(item.termID) },
  { label: 'Course', value: Courses.findDoc(item.courseID).name },
  { label: 'Verified', value: item.verified ? 'True' : 'False' },
  { label: 'From Registrar', value: item.fromRegistrar ? 'True' : 'False' },
  { label: 'Grade', value: item.grade },
  { label: 'Credit Hours', value: `${item.creditHrs}` },
  { label: 'Note', value: item.note },
  { label: 'Student', value: Users.getFullName(item.studentID) },
  { label: 'ICE', value: item.ice ? `${item.ice.i}, ${item.ice.c}, ${item.ice.e}` : '' },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: CourseInstance): string => {
  const username = Users.getProfile(item.studentID).username;
  const courseNum = Courses.findDoc(item.courseID).num;
  const term = AcademicTerms.toString(item.termID, true);
  return `${username}-${courseNum}-${term}`;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: CourseInstance): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelCourseInstancesPageProps {
  items: CourseInstance[];
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
}

const AdminDataModelCourseInstancesPage: React.FC<AdminDataModelCourseInstancesPageProps> = ({ items, terms, courses, students }) => {
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
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.creditHrs = doc.creditHours;
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
    <PageLayout id={PAGEIDS.DATA_MODEL_COURSE_INSTANCES} headerPaneTitle="Course Instances">
      {showUpdateFormState ? (
        <UpdateCourseInstanceForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} terms={terms} />
      ) : (
        <AddCourseInstanceForm terms={terms} courses={courses} students={students} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Course Instance?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const items = CourseInstances.find({}).fetch();
  // want to sort the items by their item title string
  items.sort((firstEl, secondEl) => {
    const firstStr = itemTitleString(firstEl);
    const secondStr = itemTitleString(secondEl);
    return firstStr.localeCompare(secondStr);
  });
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  return {
    items,
    terms,
    courses,
    students,
  };
})(AdminDataModelCourseInstancesPage);
