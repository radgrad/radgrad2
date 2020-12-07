import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IDescriptionPair } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/datamodel/AdminDataModelAddForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const collection = AcademicPlans;

const descriptionPairs = (plan: IAcademicPlan): IDescriptionPair[] => [
  { label: 'Name', value: plan.name },
  { label: 'Year', value: `${plan.year}` },
  { label: 'Course Choices', value: `${plan.choiceList}` },
  { label: 'Retired', value: plan.retired ? 'True' : 'False' },
];

const itemTitleString = (plan: IAcademicPlan): string => {
  const slug = Slugs.getNameFromID(plan.slugID);
  return `${plan.name} (${plan.year}) (${slug})`;
};

const itemTitle = (plan: IAcademicPlan): React.ReactNode => (
  <React.Fragment>
    {plan.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(plan)}
  </React.Fragment>
);

interface IAdminDataModelAcademicPlansPageProps extends IAdminDataModeMenuProps {
  items: IAcademicPlan[];
}
/**
 * The AcademicPlan data model page.
 * @param props The properties.
 * @constructor
 */
const AdminDataModelAcademicPlansPage: React.FC<IAdminDataModelAcademicPlansPageProps> = (props) => {
  /* CAM going to leave props as an object to make the <AdminDataModelMenu cleaner. */
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    console.log('AcademicPlans.handleAdd(%o)', doc);
    // const collectionName;
    // const definitionData;
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setConfirmOpen(false);
    setId('');
    setShowUpdateForm(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('AcademicPlans.handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

  const handleConfirmDelete = () => {
    // console.log('AcademicPlans.handleConfirmDelete');
    const collectionName = collection.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting AcademicPlan. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
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
    console.log(doc);
  };

  const paddedStyle = {
    paddingTop: 20,
  };
  const findOptions = {
    sort: { year: 1, name: 1 },
  };
  const planName = idState ? AcademicPlans.findDoc(idState).name : '';
  return (
    <div id="data-model-academic-plans-page" className="layout-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <AdminDataModelUpdateForm
              collection={AcademicPlans}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AdminDataModelAddForm collection={AcademicPlans} formRef={formRef} handleAdd={handleAdd} />
          )}

          <ListCollectionWidget
            collection={AcademicPlans}
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
        header="Delete Academic Plan?"
        content={`Delete ${planName}. Are you sure?`}
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelAcademicPlansPageContainer = withTracker(() => ({
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
  items: AcademicPlans.find({}).fetch(),
}))(AdminDataModelAcademicPlansPage);

export default withInstanceSubscriptions(AdminDataModelAcademicPlansPageContainer);
