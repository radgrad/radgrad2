import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import RadGradAlert from '../../utilities/RadGradAlert';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Course, CourseUpdate, DescriptionPair, Interest } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import { makeMarkdownLink } from './utilities/datamodel';
import { Interests } from '../../../api/interest/InterestCollection';
import { interestNameToId } from '../../components/shared/utilities/data-model';
import AddCourseForm from '../../components/admin/datamodel/course/AddCourseForm';
import UpdateCourseForm from '../../components/admin/datamodel/course/UpdateCourseForm';
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
  { label: 'Interests', value: Interests.findNames(item.interestIDs).sort() },
  { label: 'Syllabus', value: makeMarkdownLink(item.syllabus) },
  { label: 'References', value: `Course Instances: ${numReferences(item)}` },
  { label: 'Repeatable', value: item.repeatable ? 'True' : 'False' },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Course): string => (Courses.isDefined(item._id) ? Courses.getName(item._id) : '');

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
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelCoursesPage: React.FC<AdminDataModelCoursesPageProps> = ({ items, interests }) => {
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
    const updateData: CourseUpdate = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.interests = doc.interests.map(interestNameToId);
    updateData.picture = doc.picture;
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

  const headerPaneBody = `Course slugs have a fixed format:
 * The department, a lowercase string. Normally 2 to 5 characters
 * an underscore '_'
 * The course number.`;
  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_COURSES} headerPaneTitle="Courses" headerPaneBody={headerPaneBody}>
      {showUpdateFormState ? (
        <UpdateCourseForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} interests={interests} courses={items} />
      ) : (
        <AddCourseForm interests={interests} courses={items} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Course?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  // We want to sort the items.
  const items = Courses.find({}, { sort: { num: 1 } }).fetch();
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  return {
    items,
    interests,
  };
})(AdminDataModelCoursesPage);
