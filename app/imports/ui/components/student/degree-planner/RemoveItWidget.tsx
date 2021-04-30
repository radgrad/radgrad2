import React, { useState } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';

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
  const [modalOpenState, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const buttonStyle: React.CSSProperties = { padding: 0 };

  const handleRemoveIt = () => {
    handleClose();
    const instance = id;
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
