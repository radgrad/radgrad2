import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import {
  IAcademicTerm,
  ICourse,
  IDescriptionPair,
  IFeed,
  IFeedDefine,
  IOpportunity,
  IStudentProfile,
} from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Users } from '../../../api/user/UserCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AddFeedForm from '../../components/admin/datamodel/feed/AddFeedForm';
import UpdateFeedForm from '../../components/admin/datamodel/feed/UpdateFeedForm';
import {
  academicTermNameToSlug,
  courseNameToSlug,
  opportunityNameToSlug,
  profileNameToUsername,
} from '../../components/shared/utilities/data-model';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { RootState } from '../../../redux/types';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const collection = Feeds; // the collection to use.

interface IAdminDataModelFeedsPageProps extends IAdminDataModeMenuProps {
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
  items: IFeed[];
  academicTerms: IAcademicTerm[];
  courses: ICourse[];
  opportunities: IOpportunity[];
  students: IStudentProfile[];
}

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: IFeed): IDescriptionPair[] => {
  const users = [];
  _.forEach(item.userIDs, (id) => {
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

const AdminDataModelFeedsPage: React.FC<IAdminDataModelFeedsPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('Feeds.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData: IFeedDefine = doc; // create the definitionData may need to modify doc's values
    definitionData.feedType = doc.feedType;
    switch (doc.feedType) {
      case Feeds.NEW_USER:
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_COURSE:
        definitionData.course = courseNameToSlug(doc.course);
        break;
      case Feeds.NEW_COURSE_REVIEW:
        definitionData.course = courseNameToSlug(doc.course);
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_LEVEL:
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_OPPORTUNITY:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        break;
      case Feeds.NEW_OPPORTUNITY_REVIEW:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.VERIFIED_OPPORTUNITY:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        definitionData.user = profileNameToUsername(doc.user);
        definitionData.academicTerm = academicTermNameToSlug(doc.academicTerm);
        break;
      default:
        break;
    }
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
    const updateData: any = doc;
    updateData.id = doc._id;
    updateData.feedType = doc.feedType;
    updateData.users = doc.userIDs;
    updateData.opportunity = opportunityNameToSlug(doc.opportunity);
    const { isCloudinaryUsed, cloudinaryUrl } = props;
    if (isCloudinaryUsed) {
      updateData.picture = cloudinaryUrl;
    }
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
    <div id="data-model-feeds-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateFeedForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
              academicTerms={props.academicTerms}
              courses={props.courses}
              students={props.students}
              opportunities={props.opportunities}
            />
          ) : (
            <AddFeedForm
              formRef={formRef}
              handleAdd={handleAdd}
              academicTerms={props.academicTerms}
              courses={props.courses}
              students={props.students}
              opportunities={props.opportunities}
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
        header="Delete Feed?"
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelFeedsPageCon = connect(mapStateToProps)(AdminDataModelFeedsPage);

const AdminDataModelFeedsPageContainer = withTracker(() => ({
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
  items: Feeds.find({}).fetch(),
  academicTerms: AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch(),
  courses: Courses.find({}, { sort: { num: 1 } }).fetch(),
  opportunities: Opportunities.find({}, { sort: { name: 1 } }).fetch(),
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(AdminDataModelFeedsPageCon);

export default withInstanceSubscriptions(AdminDataModelFeedsPageContainer);
