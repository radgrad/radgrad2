import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { CareerGoal, Course, DescriptionPair, Interest, Opportunity, Teaser } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
  updateCallBack,
} from './utilities/data-model-page-callbacks';
import { makeYoutubeLink } from './utilities/datamodel';
import AddTeaserForm from '../../components/admin/datamodel/teaser/AddTeaserForm';
import UpdateTeaserForm from '../../components/admin/datamodel/teaser/UpdateTeasersForm';
import { itemToSlugName, interestNameToSlug } from '../../components/shared/utilities/data-model';
import { Slugs } from '../../../api/slug/SlugCollection';
import PageLayout from '../PageLayout';

const collection = Teasers; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Teaser): DescriptionPair[] => [
  { label: 'Description', value: item.description },
  { label: 'Author', value: item.author },
  { label: 'Duration', value: item.duration },
  { label: 'Interests', value: _.sortBy(Interests.findNames(item.interestIDs)) },
  { label: 'Youtube ID', value: makeYoutubeLink(item.url) },
  { label: 'Target Slug', value: Slugs.findDoc(item.targetSlugID).name },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Teaser): string => {
  const slugName = itemToSlugName(item);
  const title = `${item.title} (${slugName})`;
  return title;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: Teaser): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelTeasersPageProps {
  items: Teaser[];
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
}

const AdminDataModelTeasersPage: React.FC<AdminDataModelTeasersPageProps> = ({ items, careerGoals, courses, interests, opportunities }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('Teasers.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.interests = doc.interests.map(interestNameToSlug);
    updateData.targetSlug = Slugs.findDoc(doc.targetSlugID).name;
    // console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id="data-model-teasers-page" headerPaneTitle="Teasers">
      {showUpdateFormState ? (
        <UpdateTeaserForm
          collection={collection}
          id={idState}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          itemTitleString={itemTitleString}
          opportunities={opportunities}
          courses={courses}
          interests={interests}
          careerGoals={careerGoals}
        />
      ) : (
        <AddTeaserForm opportunities={opportunities}
                       courses={courses} interests={interests} careerGoals={careerGoals}/>
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

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Teaser?"/>
    </PageLayout>
  );
};

const AdminDataModelTeasersPageContainer = withTracker(() => {
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const items = Teasers.find({}).fetch();
  return {
    items,
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(AdminDataModelTeasersPage);

export default AdminDataModelTeasersPageContainer;
