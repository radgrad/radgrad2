import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import {
  ICareerGoal, ICourse,
  IDescriptionPair, IInterest, IOpportunity,
  ITeaser,
} from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';
import { makeYoutubeLink } from './utilities/datamodel';
import AddTeaserForm from '../../components/admin/datamodel/teaser/AddTeaserForm';
import UpdateTeaserForm from '../../components/admin/datamodel/teaser/UpdateTeasersForm';
import {
  itemToSlugName,
  interestNameToSlug,
  slugNameAndTypeToName,
} from '../../components/shared/utilities/data-model';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { Slugs } from '../../../api/slug/SlugCollection';

const collection = Teasers; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: ITeaser): IDescriptionPair[] => [
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
const itemTitleString = (item: ITeaser): string => {
  const slugName = itemToSlugName(item);
  const title = `${item.title} (${slugName})`;
  return title;
};

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: ITeaser): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface IAdminDataModelTeasersPageProps extends IAdminDataModeMenuProps {
  items: ITeaser[];
  careerGoals: ICareerGoal[];
  courses: ICourse[];
  interests: IInterest[];
  opportunities: IOpportunity[];
}

const AdminDataModelTeasersPage: React.FC<IAdminDataModelTeasersPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('Teasers.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    definitionData.interests = _.map(doc.interests, interestNameToSlug);
    definitionData.targetSlug = slugNameAndTypeToName(doc.targetSlug);
    definitionData.url = doc.youtubeID;
    // definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
    // console.log(collectionName, definitionData);
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
      }
      // @ts-ignore
      formRef.current.reset();
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
        console.error('Error deleting. %o', error);
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
    // console.log('Teasers.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.interests = _.map(doc.interests, interestNameToSlug);
    updateData.targetSlug = Slugs.findDoc(doc.targetSlugID).name;
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
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <div id="data-model-teasers-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateTeaserForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
              opportunities={props.opportunities}
              courses={props.courses}
              interests={props.interests}
              careerGoals={props.careerGoals}
            />
          ) : (
            <AddTeaserForm
              formRef={formRef}
              handleAdd={handleAdd}
              opportunities={props.opportunities}
              courses={props.courses}
              interests={props.interests}
              careerGoals={props.careerGoals}
            />
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
      <Confirm
        open={confirmOpenState}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        header="Delete Teaser?"
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelTeasersPageContainer = withTracker(() => {
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  const courses = Courses.find({}, { sort: { num: 1 } }).fetch();
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  return {
    academicPlanCount: AcademicPlans.count(),
    academicTermCount: AcademicTerms.count(),
    academicYearCount: AcademicYearInstances.count(),
    advisorLogCount: AdvisorLogs.count(),
    careerGoalCount: CareerGoals.count(),
    courseInstanceCount: CourseInstances.count(),
    courseCount: Courses.count(),
    feedCount: Feeds.count(),
    feedbackCount: FeedbackInstances.count(),
    helpMessageCount: HelpMessages.count(),
    interestCount: Interests.count(),
    interestTypeCount: InterestTypes.count(),
    opportunityCount: Opportunities.count(),
    opportunityInstanceCount: OpportunityInstances.count(),
    opportunityTypeCount: OpportunityTypes.count(),
    planChoiceCount: PlanChoices.count(),
    reviewCount: Reviews.count(),
    slugCount: Slugs.count(),
    teaserCount: Teasers.count(),
    usersCount: Users.count(),
    verificationRequestCount: VerificationRequests.count(),
    items: Teasers.find({}).fetch(),
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(AdminDataModelTeasersPage);

export default withInstanceSubscriptions(AdminDataModelTeasersPageContainer);
