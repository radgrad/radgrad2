import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import {
  IAcademicTerm,
  ICourse,
  IDescriptionPair,
  IOpportunity,
  IReview,
  IStudentProfile,
} from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import AddReviewForm from '../../components/admin/datamodel/review/AddReviewForm';
import UpdateReviewForm from '../../components/admin/datamodel/review/UpdateReviewForm';
import {
  academicTermNameToSlug,
  courseNameToSlug,
  opportunityNameToSlug,
  profileNameToUsername,
} from '../../components/shared/utilities/data-model';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const collection = Reviews; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: IReview): IDescriptionPair[] => {
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
const itemTitleString = (item: IReview): string => `(${Slugs.getNameFromID(item.slugID)})`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: IReview): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface IAdminDataModelReviewsPageProps extends IAdminDataModeMenuProps {
  items: IReview[];
  terms: IAcademicTerm[];
  courses: ICourse[];
  students: IStudentProfile[];
  opportunities: IOpportunity[];
}

const AdminDataModelReviewsPage: React.FC<IAdminDataModelReviewsPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('Reviews.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    definitionData.student = profileNameToUsername(doc.student);
    if (doc.reviewType === Reviews.COURSE) {
      definitionData.reviewee = courseNameToSlug(doc.reviewee);
    } else {
      definitionData.reviewee = opportunityNameToSlug(doc.reviewee);
    }
    definitionData.academicTerm = academicTermNameToSlug(doc.academicTerm);
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
    // console.log('Reviews.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateData.academicTerm = academicTermNameToSlug(doc.academicTerm);
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
    <div id="data-model-reviews-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateReviewForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
              terms={props.terms}
            />
          ) : (
            <AddReviewForm
              formRef={formRef}
              handleAdd={handleAdd}
              terms={props.terms}
              students={props.students}
              opportunities={props.opportunities}
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
        header="Delete Review?"
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelReviewsPageContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find().fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
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
    items: Reviews.find({}).fetch(),
    terms,
    courses,
    students,
    opportunities,
  };
})(AdminDataModelReviewsPage);

export default withInstanceSubscriptions(AdminDataModelReviewsPageContainer);
