import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { AcademicTerm, Course, DescriptionPair, Opportunity, Review, StudentProfile } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import AddReviewForm from '../../components/admin/datamodel/review/AddReviewForm';
import UpdateReviewForm from '../../components/admin/datamodel/review/UpdateReviewForm';
import { academicTermNameToSlug } from '../../components/shared/utilities/data-model';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
  updateCallBack,
} from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = Reviews; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Review): DescriptionPair[] => {
  let reviewee;
  if (item.reviewType === 'course') {
    reviewee = Courses.findDoc(item.revieweeID);
  } else if (item.reviewType === 'opportunity') {
    reviewee = Opportunities.findDoc(item.revieweeID);
  }
  return [
    { label: 'Student', value: Users.getFullName(item.studentID) },
    { label: 'Review Type', value: item.reviewType },
    { label: 'Reviewee', value: reviewee.name },
    { label: 'Semester', value: AcademicTerms.toString(item.termID, false) },
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
const itemTitleString = (item: Review): string => `(${Slugs.getNameFromID(item.slugID)})`;

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
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id="data-model-reviews-page" headerPaneTitle="Reviews" headerPaneBody="Be sure to select the reviewee. If you don't you will get an error.">
      {showUpdateFormState ? (
        <UpdateReviewForm collection={collection} id={idState} handleUpdate={handleUpdate}
                          handleCancel={handleCancel} itemTitleString={itemTitleString} terms={terms}/>
      ) : (
        <AddReviewForm terms={terms} students={students}
                       opportunities={opportunities} courses={courses}/>
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
        items={items}
      />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Review?"/>
    </PageLayout>
  );
};

const AdminDataModelReviewsPageContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find().fetch();
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

export default AdminDataModelReviewsPageContainer;
