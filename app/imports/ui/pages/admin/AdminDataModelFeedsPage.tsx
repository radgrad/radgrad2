import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import {
  AcademicTerm,
  Course,
  DescriptionPair,
  FeedUpdate,
  IFeed,
  Opportunity,
  StudentProfile,
} from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Users } from '../../../api/user/UserCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddFeedForm from '../../components/admin/datamodel/feed/AddFeedForm';
import UpdateFeedForm from '../../components/admin/datamodel/feed/UpdateFeedForm';
import { opportunityNameToSlug } from '../../components/shared/utilities/data-model';
import { dataModelActions } from '../../../redux/admin/data-model';
import { RootState } from '../../../redux/types';
import { PAGEIDS } from '../../utilities/PageIDs';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
  updateCallBack,
} from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = Feeds; // the collection to use.

interface AdminDataModelFeedsPageProps {
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
  items: IFeed[];
  academicTerms: AcademicTerm[];
  courses: Course[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: IFeed): DescriptionPair[] => {
  const users = [];
  item.userIDs.forEach((id) => {
    users.push(Users.getFullName(id));
  });
  let opportunityName = '';
  if (item.opportunityID) {
    opportunityName = Opportunities.findDoc(item.opportunityID).name;
  }
  let courseName = '';
  if (item.courseID) {
    const course = Courses.findDoc(item.courseID);
    courseName = `${course.num}: ${course.shortName}`;
  }
  let academicTerm = '';
  if (item.termID) {
    academicTerm = AcademicTerms.toString(item.termID);
  }
  return [
    { label: 'Feed Type', value: item.feedType },
    { label: 'Description', value: item.description },
    { label: 'Timestamp', value: item.timestamp.toString() },
    {
      label: 'Picture',
      value: `![${item.picture}](${item.picture})`,
    },
    { label: 'Users', value: users.toString() },
    { label: 'Opportunity', value: opportunityName },
    { label: 'Course', value: courseName },
    { label: 'Academic Term', value: academicTerm },
    { label: 'Retired', value: item.retired ? 'True' : 'False' },
  ];
};

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: IFeed): string => `${item.feedType} ${item.description}`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: IFeed): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

const mapStateToProps = (state: RootState): unknown => ({
  isCloudinaryUsed: state.shared.cloudinary.adminDataModelFeeds.isCloudinaryUsed,
  cloudinaryUrl: state.shared.cloudinary.adminDataModelFeeds.cloudinaryUrl,
});

const AdminDataModelFeedsPage: React.FC<AdminDataModelFeedsPageProps> = ({ isCloudinaryUsed, cloudinaryUrl, courses, academicTerms, items, students, opportunities }) => {
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
    const updateData: FeedUpdate = doc;
    updateData.id = doc._id;
    updateData.users = doc.userIDs;
    updateData.opportunity = opportunityNameToSlug(doc.opportunity);
    if (isCloudinaryUsed) {
      updateData.picture = cloudinaryUrl;
    }
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_FEEDS} headerPaneTitle="Feeds" headerPaneBody="There be dragons here">
      {showUpdateFormState ? (
        <UpdateFeedForm
          collection={collection}
          id={idState}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          itemTitleString={itemTitleString}
          academicTerms={academicTerms}
          courses={courses}
          students={students}
          opportunities={opportunities}
        />
      ) : (
        <AddFeedForm academicTerms={academicTerms} courses={courses}
                     students={students} opportunities={opportunities}/>
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
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Feed?"/>
    </PageLayout>
  );
};

const AdminDataModelFeedsPageCon = connect(mapStateToProps)(AdminDataModelFeedsPage);

const AdminDataModelFeedsPageContainer = withTracker(() => {
  const items = Feeds.find({}).fetch();
  const academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  return {
    items,
    academicTerms,
    courses,
    opportunities,
    students,
  };
})(AdminDataModelFeedsPageCon);

export default AdminDataModelFeedsPageContainer;
