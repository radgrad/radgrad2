import React, { useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import RadGradAlert from '../../../utilities/RadGradAlert';

interface RemoveItWidgetProps {
  collectionName: string;
  id: string;
  name: string;
  courseNumber: string;
}

const RemoveIt: React.FC<RemoveItWidgetProps> = ({ collectionName, id, name, courseNumber }) => {
  const [modalOpenState, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const buttonStyle: React.CSSProperties = { padding: 0 };

  const handleRemoveIt = () => {
    handleClose();
    const instance = id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        RadGradAlert.success('Remove Succeeded');
      })
      .catch((error) => {
        RadGradAlert.failure(`Remove ${collectionName}: ${instance} failed.`, error.message, error);
      });

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
            Do you want to remove {name} from your plan?
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

export default RemoveIt;
