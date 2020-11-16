import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu, { IAdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import {
  IAcademicTerm,
  IAcademicTermDefine,
  IDescriptionPair,
} from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/datamodel/AdminDataModelAddForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import withInstanceSubscriptions from '../../layouts/utilities/InstanceSubscriptionsHOC';

function numReferences(term) {
  let references = 0;
  [CourseInstances, OpportunityInstances].forEach((entity) => {
    _.forEach(entity.find().fetch(), (e) => {
      if (e.termID === term._id) {
        references++;
      }
    });
  });
  _.forEach(Opportunities.find().fetch(), (e) => {
    if (_.includes(e.termIDs, term._id)) {
      references++;
    }
  });
  return references;
}

function descriptionPairs(term: IAcademicTerm): IDescriptionPair[] {
  return [
    { label: 'Term', value: AcademicTerms.toString(term._id, false) },
    { label: 'Term Number', value: `${term.termNumber}` },
    { label: 'References', value: `${numReferences(term)}` },
    { label: 'Retired', value: term.retired ? 'True' : 'False' },
  ];
}

const itemTitle = (term: IAcademicTerm): React.ReactNode => (
  <React.Fragment>
    {term.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {AcademicTerms.toString(term._id, false)}
  </React.Fragment>
);

const itemTitleString = (term) => AcademicTerms.toString(term._id, false);

interface IAdminDataModelAcademicTermsPageProps extends IAdminDataModeMenuProps {
  items: IAcademicTerm[];
}

const AdminDataModelAcademicTermsPage = (props: IAdminDataModelAcademicTermsPageProps) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = AcademicTerms.getCollectionName();
    const definitionData: IAcademicTermDefine = doc;
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
    setConfirmOpen(false);
    setId('');
    setShowUpdateForm(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

  const handleConfirmDelete = () => {
    const collectionName = AcademicTerms.getCollectionName();
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
    const collectionName = AcademicTerms.getCollectionName();
    const updateData: { id?: string, retired?: boolean } = {};
    updateData.id = doc._id;
    updateData.retired = doc.retired;
    // console.log('parameter = %o', { collectionName, updateData });
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating AcademicTerm. %o', error);
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
    sort: { termNumber: 1 },
  };
  return (
    <div id="data-model-academic-terms-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <AdminDataModelUpdateForm
              collection={AcademicTerms}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AdminDataModelAddForm collection={AcademicTerms} formRef={formRef} handleAdd={handleAdd} />
          )}
          <ListCollectionWidget
            collection={AcademicTerms}
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
        header="Delete Academic Term?"
      />
      <BackToTopButton />
    </div>
  );
};

const AdminDataModelAcademicTermsPageContainer = withTracker(() => ({
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
  items: AcademicTerms.find({}).fetch(),
}))(AdminDataModelAcademicTermsPage);

export default withInstanceSubscriptions(AdminDataModelAcademicTermsPageContainer);
