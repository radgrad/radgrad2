import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
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
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { ICourse, IDescriptionPair, IInterest } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';
import { makeMarkdownLink } from './utilities/datamodel';
import { Interests } from '../../../api/interest/InterestCollection';
import {
  courseNameToSlug,
  courseToName, itemToSlugName,
  interestNameToId,
} from '../../components/shared/utilities/data-model';
import AddCourseForm from '../../components/admin/datamodel/course/AddCourseForm';
import { interestSlugFromName } from '../../components/shared/utilities/form';
import UpdateCourseForm from '../../components/admin/datamodel/course/UpdateCourseForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';

const collection = Courses; // the collection to use.

function numReferences(course: ICourse) {
  return CourseInstances.find({ courseID: course._id }).count();
}

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: ICourse): IDescriptionPair[] => [
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
const itemTitleString = (item: ICourse): string => `${courseToName(item)} (${itemToSlugName(item)})`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: ICourse): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface IAdminDataModelCoursesPageProps extends IAdminDataModeMenuProps {
  items: ICourse[];
  interests: IInterest[];
  courses: ICourse[];
}

const AdminDataModelCoursesPage: React.FC<IAdminDataModelCoursesPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('CoursePage.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData: any = {}; // create the definitionData may need to modify doc's values
    const interests = _.map(doc.interests, interestSlugFromName);
    definitionData.slug = doc.slug;
    definitionData.name = doc.name;
    definitionData.num = doc.num;
    definitionData.description = doc.description;
    if (doc.shortName) {
      definitionData.shortName = doc.shortName;
    } else {
      definitionData.shortName = doc.name;
    }
    definitionData.interests = interests;
    if (doc.prerequisites) {
      definitionData.prerequisites = _.map(doc.prerequisites, courseNameToSlug);
    }
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
    updateData.prerequisites = _.map(doc.prerequisiteNames, courseNameToSlug);
    updateData.interests = _.map(doc.interests, interestNameToId);
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
    sort: { num: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <div id="data-model-courses-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateCourseForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
              interests={props.interests}
              courses={props.courses}
            />
          ) : (
            <AddCourseForm
              formRef={formRef}
              handleAdd={handleAdd}
              interests={props.interests}
              courses={props.courses}
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
        header="Delete Course?"
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelCoursesPageContainer = withTracker(() => ({
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
  items: Courses.find({}).fetch(),
  interests: Interests.find({}, { sort: { name: 1 } }).fetch(),
  courses: Courses.find({}, { sort: { num: 1 } }).fetch(),
}))(AdminDataModelCoursesPage);

export default withInstanceSubscriptions(AdminDataModelCoursesPageContainer);
