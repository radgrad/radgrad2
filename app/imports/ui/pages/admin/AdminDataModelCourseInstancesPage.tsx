import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { AdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicTerm, Course, CourseInstance, CourseInstanceDefine, DescriptionPair, StudentProfile } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Users } from '../../../api/user/UserCollection';
import AddCourseInstanceForm from '../../components/admin/datamodel/course/AddCourseInstanceForm';
import { Slugs } from '../../../api/slug/SlugCollection';
import { academicTermNameToDoc, courseNameToCourseDoc, profileNameToUsername } from '../../components/shared/utilities/data-model';
import UpdateCourseInstanceForm from '../../components/admin/datamodel/course/UpdateCourseInstanceForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { getDatamodelCount } from './utilities/datamodel';

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

interface AdminDataModelCourseInstancesPageProps extends AdminDataModeMenuProps {
  items: CourseInstance[];
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelCourseInstancesPage: React.FC<AdminDataModelCourseInstancesPageProps> = (props) => {
  // TODO deconstruct props
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('CourseInstancePage.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const academicTermDoc = academicTermNameToDoc(doc.term);
    const academicTerm = Slugs.getNameFromID(academicTermDoc.slugID);
    const note = doc.course.substring(0, doc.course.indexOf(':'));
    const courseDoc = courseNameToCourseDoc(doc.course);
    const course = Slugs.getNameFromID(courseDoc.slugID);
    const student = profileNameToUsername(doc.student);
    const definitionData: CourseInstanceDefine = {
      academicTerm,
      course,
      note,
      student,
      grade: doc.grade,
    };
    // console.log('definitionData=%o', definitionData);
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
        console.error('Error deleting CourseInstance. %o', error);
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
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.creditHrs = doc.creditHours;
    updateData.termID = academicTermNameToDoc(doc.academicTerm)._id;
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

  const paddedStyle = {
    paddingTop: 20,
  };
  const findOptions = {
    sort: { note: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <div id="data-model-course-instances-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>
        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateCourseInstanceForm collection={collection} id={idState} formRef={formRef} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} terms={props.terms} />
          ) : (
            <AddCourseInstanceForm formRef={formRef} handleAdd={handleAdd} terms={props.terms} courses={props.courses} students={props.students} />
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
        </Grid.Column>
      </Grid>
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Course Instance?" />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelCourseInstancesPageContainer = withTracker(() => {
  const items = CourseInstances.find({}).fetch();
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find().fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    terms,
    courses,
    students,
  };
})(AdminDataModelCourseInstancesPage);

export default AdminDataModelCourseInstancesPageContainer;
