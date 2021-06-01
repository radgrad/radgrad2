import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { DegreePlannerStateNames } from '../../../pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../utilities/StickyState';
import { TabbedProfileEntryNames } from './TabbedProfileEntries';

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
  const [, setSelectedCiID] = useStickyState(DegreePlannerStateNames.selectedCiID, '');
  const [, setSelectedOiID] = useStickyState(DegreePlannerStateNames.selectedOiID, '');
  const [, setSelectedProfileTab] = useStickyState(DegreePlannerStateNames.selectedProfileTab, '');

  const handleRemoveIt = () => {
    handleClose();
    const instance = id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        Swal.fire({
          title: 'Remove Succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        setSelectedOiID('');
        setSelectedCiID('');
        setSelectedProfileTab(TabbedProfileEntryNames.profileOpportunities);
      })
      .catch((error) => {
        console.error(`Remove ${collectionName}: ${instance} failed.`, error);
        Swal.fire({
          title: `Remove ${collectionName}: ${instance} failed.`,
          icon: 'error',
          text: error.message,
        });
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

export default RemoveIt;
