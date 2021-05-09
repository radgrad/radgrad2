import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { useStickyState } from '../../../utilities/StickyState';

interface RemoveItWidgetProps {
  collectionName: string;
  id: string;
  name: string;
  courseNumber: string;
}

const RemoveItWidget: React.FC<RemoveItWidgetProps> = ({ collectionName, id, name, courseNumber }) => {
  const [modalOpenState, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const buttonStyle: React.CSSProperties = { padding: 0 };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCourse, setSelectedCourse] = useStickyState('Planner.selectedCourse', '');

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
    setSelectedCourse('');
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

export default RemoveItWidget;
