import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { ReviewTypes } from '../../../api/review/ReviewTypes';
import RadGradAlert from '../../utilities/RadGradAlert';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicTerm, Course, DescriptionPair, Opportunity, Review, StudentProfile } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import AddReviewForm from '../../components/admin/datamodel/review/AddReviewForm';
import UpdateReviewForm from '../../components/admin/datamodel/review/UpdateReviewForm';
import { academicTermNameToSlug } from '../../components/shared/utilities/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = Reviews; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Review): DescriptionPair[] => {
  let reviewee;
  if (item.reviewType === ReviewTypes.COURSE) {
    reviewee = Courses.findDoc(item.revieweeID);
  } else if (item.reviewType === ReviewTypes.OPPORTUNITY) {
    reviewee = Opportunities.findDoc(item.revieweeID);
  }
  return [
    { label: 'Student', value: Users.getFullName(item.studentID) },
    { label: 'Review Type', value: item.reviewType },
    { label: 'Reviewee', value: reviewee?.name },
    { label: 'Academic Term', value: AcademicTerms.toString(item.termID, false) },
    { label: 'Rating', value: `${item.rating}` },
    { label: 'Comments', value: item.comments },
    { label: 'Moderated', value: item.moderated ? 'True' : 'False' },
    { label: 'Visible', value: item.visible ? 'True' : 'False' },
    { label: 'Moderator Comments', value: item.moderatorComments ? item.moderatorComments : ' ' },
    { label: 'Retired', value: item.retired ? 'True' : 'False' },
  ];
};

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Review): string => {
  if (Reviews.isDefined(item._id)) {
    const student = StudentProfiles.findDoc({ userID: item.studentID });
    let reviewee;
    if (item.reviewType === ReviewTypes.COURSE) {
      reviewee = Courses.findDoc(item.revieweeID);
    } else if (item.reviewType === ReviewTypes.OPPORTUNITY) {
      reviewee = Opportunities.findDoc(item.revieweeID);
    }
    const term = AcademicTerms.toString(item.termID, false);
    return `${student.username}, ${reviewee.name}, ${term}`;
  }
  return '';
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: Review): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelReviewsPageProps {
  items: Review[];
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
  opportunities: Opportunity[];
}

const AdminDataModelReviewsPage: React.FC<AdminDataModelReviewsPageProps> = ({ items, terms, courses, students, opportunities }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('Reviews.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.academicTerm = academicTermNameToSlug(doc.academicTerm);
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
    <PageLayout id={PAGEIDS.DATA_MODEL_REVIEWS} headerPaneTitle="Reviews" headerPaneBody="Be sure to select the reviewee. If you don't you will get an error.">
      {showUpdateFormState ? (
        <UpdateReviewForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} terms={terms} />
      ) : (
        <AddReviewForm terms={terms} students={students} opportunities={opportunities} courses={courses} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Review?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const items = Reviews.find({}).fetch();
  return {
    items,
    terms,
    courses,
    students,
    opportunities,
  };
})(AdminDataModelReviewsPage);
