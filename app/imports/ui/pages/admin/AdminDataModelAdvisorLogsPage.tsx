import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
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
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  IAdvisorLog, IAdvisorLogUpdate,
  IDescriptionPair,
} from '../../../typings/radgrad';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AddAdvisorLogFormContainer from '../../components/admin/datamodel/advisor-log/AddAdvisorLogForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

const descriptionPairs = (advisorLog: IAdvisorLog): IDescriptionPair[] => [
  { label: 'Advisor', value: `${Users.getFullName(advisorLog.advisorID)}` },
  { label: 'Student', value: `${Users.getFullName(advisorLog.studentID)}` },
  { label: 'Text', value: advisorLog.text },
];

const itemTitle = (advisorLog: IAdvisorLog): React.ReactNode => {
  // console.log(advisorLog);
  const name = Users.getFullName(advisorLog.studentID);
  return (
    <React.Fragment>
      {advisorLog.retired ? <Icon name="eye slash" /> : ''}
      <Icon name="dropdown" />
      {`${name} ${advisorLog.createdOn}`}
    </React.Fragment>
  );
};

const itemTitleString = (advisorLog: IAdvisorLog): string => `${Users.getFullName(advisorLog.studentID)} ${advisorLog.createdOn}`;

interface IAdminDataModelAdvisorLogsPageProps extends IAdminDataModeMenuProps {
  items: IAdvisorLog[];
  advisors: Meteor.User[];
  students: Meteor.User[];
}

const AdminDataModelAdvisorLogsPage = (props: IAdminDataModelAdvisorLogsPageProps) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = AdvisorLogs.getCollectionName();
    const definitionData = doc;
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
        // console.log(formRef);
        // @ts-ignore
        formRef.current.reset();
      }
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    // console.log('formRef = %o', this.formRef);
    // @ts-ignore
    formRef.current.reset();
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
    const collectionName = AdvisorLogs.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // this.formRef.current.reset();
        setId('');
        setConfirmOpen(false);
      }
    });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o ref=%o', inst, this.formRef);
    setShowUpdateForm(true);
    setId(inst.id);
  };

  const handleUpdate = (doc) => {
    // console.log('handleUpdate(%o) ref=%o', doc, this.formRef);
    const collectionName = AdvisorLogs.getCollectionName();
    const updateData: IAdvisorLogUpdate = {};
    updateData.id = doc._id;
    updateData.text = doc.text;
    updateData.retired = doc.retired;
    // console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // @ts-ignore
        formRef.current.reset();
        setShowUpdateForm(false);
        setId('');
      }
    });
  };

  const paddedStyle = {
    paddingTop: 20,
  };
  const findOptions = {
    sort: { createdOn: 1 },
  };
  return (
    <div id="data-model-advisor-logs-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <AdminDataModelUpdateForm
              collection={AdvisorLogs}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AddAdvisorLogFormContainer
              formRef={formRef}
              handleAdd={handleAdd}
              students={props.students}
              advisors={props.advisors}
            />
          )}
          <ListCollectionWidget
            collection={AdvisorLogs}
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
        header="Delete Advisor Log?"
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelAdvisorLogsPageContainer = withTracker(() => ({
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
  items: AdvisorLogs.find({}).fetch(),
  advisors: AdvisorProfiles.find({}, { $sort: { lastName: 1, firstName: 1 } }).fetch(),
  students: StudentProfiles.find({ isAlumni: false }, { $sort: { lastName: 1, firstName: 1 } }).fetch(),
  }))(AdminDataModelAdvisorLogsPage);

export default withInstanceSubscriptions(AdminDataModelAdvisorLogsPageContainer);
