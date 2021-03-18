import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { AcademicTerm, CourseInstance, OpportunityInstance, UserInteractionDefine } from '../../../../typings/radgrad';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { getUsername } from '../../shared/utilities/router';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface RemoveItWidgetProps {
  collectionName: string;
  id: string;
  name: string;
  courseNumber: string;
  selectCourseInstance: (courseInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
});

const RemoveItWidget: React.FC<RemoveItWidgetProps> = ({ collectionName, id, name, courseNumber, selectCourseInstance }) => {
  const match = useRouteMatch();
  const [modalOpenState, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);

  const handleClose = () => setModalOpen(false);

  const buttonStyle: React.CSSProperties = { padding: 0 };

  const handleRemoveIt = () => {
    handleClose();
    const instance = id;
    let type;
    let slugName;
    let instanceObject: CourseInstance | OpportunityInstance;
    if (collectionName === CourseInstances.getCollectionName()) {
      type = UserInteractionsTypes.REMOVE_COURSE;
      slugName = CourseInstances.getCourseSlug(instance);
      instanceObject = CourseInstances.findDoc({ _id: instance });
    } else {
      type = UserInteractionsTypes.REMOVE_OPPORTUNITY;
      slugName = OpportunityInstances.getOpportunitySlug(instance);
      instanceObject = OpportunityInstances.findDoc({ _id: instance });
    }
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error(`Remove ${collectionName}: ${instance} failed.`, error);
      } else {
        Swal.fire({
          title: 'Remove Succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        const username = getUsername(match);
        const instanceAcademicTerm: AcademicTerm = AcademicTerms.findDoc({ _id: instanceObject.termID });
        const typeData = [instanceAcademicTerm.term, instanceAcademicTerm.year, slugName];
        const interactionData: UserInteractionDefine = { username, type, typeData };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.error('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    });
    selectCourseInstance('');
  };

  return (
    <Modal
      trigger={
        <Button icon circular basic onClick={handleOpen} style={buttonStyle}>
          <Icon name="remove circle" color="red" />
        </Button>
      }
      open={modalOpenState}
      onClose={handleClose}
      size="small"
    >
      <Modal.Header>Remove {name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            Do you want to remove {courseNumber} {name} from your plan?
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={handleRemoveIt}>
          <Icon name="checkmark" />
          Yes
        </Button>
        <Button color="red" onClick={handleClose}>
          <Icon name="cancel" />
          No
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const RemoveItWidgetContainer = connect(null, mapDispatchToProps)(RemoveItWidget);
export default RemoveItWidgetContainer;
