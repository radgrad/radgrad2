import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import { AdvisorProfiles } from '../../../../app/imports/api/user/AdvisorProfileCollection';
import { StudentProfiles } from '../../../../app/imports/api/user/StudentProfileCollection';
import AdminPageMenu from '../../../../app/imports/ui/components/admin/AdminPageMenu';
import AdminDataModelMenu, { AdminDataModeMenuProps } from '../../../../app/imports/ui/components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../../../app/imports/ui/components/admin/datamodel/ListCollectionWidget';
import { Users } from '../../../../app/imports/api/user/UserCollection';
import {
  AdvisorLog, AdvisorLogUpdate,
  DescriptionPair,
} from '../../../../app/imports/typings/radgrad';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../../app/imports/api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../../../app/imports/ui/components/admin/datamodel/AdminDataModelUpdateForm';
import AddAdvisorLogFormContainer from '../../component/admin/advisor-log/AddAdvisorLogForm';
import BackToTopButton from '../../../../app/imports/ui/components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { getDatamodelCount } from '../../../../app/imports/ui/pages/admin/utilities/datamodel';
import RadGradAlert from '../../../../app/imports/ui/utilities/RadGradAlert';

const descriptionPairs = (advisorLog: AdvisorLog): DescriptionPair[] => [
  { label: 'Advisor', value: `${Users.getFullName(advisorLog.advisorID)}` },
  { label: 'Student', value: `${Users.getFullName(advisorLog.studentID)}` },
  { label: 'Text', value: advisorLog.text },
];

const itemTitle = (advisorLog: AdvisorLog): React.ReactNode => {
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

const itemTitleString = (advisorLog: AdvisorLog): string => `${Users.getFullName(advisorLog.studentID)} ${advisorLog.createdOn}`;

interface AdminDataModelAdvisorLogsPageProps extends AdminDataModeMenuProps {
  items: AdvisorLog[];
  advisors: Meteor.User[];
  students: Meteor.User[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelAdvisorLogsPage: React.FC<AdminDataModelAdvisorLogsPageProps> = (props) => {
  // TODO deconstruct props
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
        RadGradAlert.failure('Add failed.', error.message, error);
      } else {
        RadGradAlert.success('Add succeeded');
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
        RadGradAlert.failure('Delete failed', error.message, error);
      } else {
        RadGradAlert.success('Delete succeeded');
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
    const updateData: AdvisorLogUpdate = {};
    updateData.id = doc._id;
    updateData.text = doc.text;
    updateData.retired = doc.retired;
    // console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        RadGradAlert.failure('Update failed.', error.message, error);
      } else {
        RadGradAlert.success('Update succeeded');
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
      <AdminPageMenu />
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

const AdminDataModelAdvisorLogsPageContainer = withTracker(() => {
  const items = AdvisorLogs.find({}).fetch();
  const advisors = AdvisorProfiles.find({}, { $sort: { lastName: 1, firstName: 1 } }).fetch();
  const students = StudentProfiles.find({ isAlumni: false }, { $sort: { lastName: 1, firstName: 1 } }).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    advisors,
    students,
  };
})(AdminDataModelAdvisorLogsPage);

export default AdminDataModelAdvisorLogsPageContainer;
