import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Course, DescriptionPair, Interest } from '../../../typings/radgrad';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { getDatamodelCount, makeMarkdownLink } from './utilities/datamodel';
import { Interests } from '../../../api/interest/InterestCollection';
import { courseNameToSlug, courseToName, itemToSlugName, interestNameToId } from '../../components/shared/utilities/data-model';
import AddCourseForm from '../../components/admin/datamodel/course/AddCourseForm';
import UpdateCourseForm from '../../components/admin/datamodel/course/UpdateCourseForm';
import { dataModelActions } from '../../../redux/admin/data-model';
import PageLayout from '../PageLayout';

const collection = Courses; // the collection to use.

const numReferences = (course: Course) => CourseInstances.find({ courseID: course._id }).count();

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Course): DescriptionPair[] => [
  { label: 'Description', value: item.description },
  { label: 'Credit Hours', value: `${item.creditHrs}` },
  { label: 'Interests', value: _.sortBy(Interests.findNames(item.interestIDs)) },
  { label: 'Syllabus', value: makeMarkdownLink(item.syllabus) },
  { label: 'Prerequisites', value: item.prerequisites },
  { label: 'References', value: `Course Instances: ${numReferences(item)}` },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Course): string => `${courseToName(item)} (${itemToSlugName(item)})`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: Course): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelCoursesPageProps {
  items: Course[];
  interests: Interest[];
  courses: Course[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelCoursesPage: React.FC<AdminDataModelCoursesPageProps> = (props) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

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
        console.error('Error deleting AcademicTerm. %o', error);
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
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData: any = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.prerequisites = doc.prerequisiteNames.map(courseNameToSlug);
    updateData.interests = doc.interests.map(interestNameToId);
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
    sort: { num: 1 }, // determine how you want to sort the items in the list
  };
  const headerPaneBody = `Course slugs have a fixed format:
 * The department, a lowercase string. Normally 2 to 5 characters
 * an underscore '_'
 * The course number.`;
  return (
    <PageLayout id="data-model-courses-page" headerPaneTitle="Courses" headerPaneBody={headerPaneBody}>
      {showUpdateFormState ? (
        <UpdateCourseForm collection={collection} id={idState} handleUpdate={handleUpdate}
                          handleCancel={handleCancel} itemTitleString={itemTitleString} interests={props.interests}
                          courses={props.courses}/>
      ) : (
        <AddCourseForm interests={props.interests} courses={props.courses}/>
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

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Course?"/>
    </PageLayout>
  );
};

const AdminDataModelCoursesPageContainer = withTracker(() => {
  const items = Courses.find({}).fetch();
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    interests,
    courses,
  };
})(AdminDataModelCoursesPage);

export default AdminDataModelCoursesPageContainer;
