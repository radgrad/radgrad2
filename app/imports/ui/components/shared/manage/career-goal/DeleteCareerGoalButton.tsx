import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../../typings/radgrad';

interface DeleteCareerGoalButtonProps {
  careerGoal: CareerGoal;
}

const DeleteCareerGoalButton: React.FC<DeleteCareerGoalButtonProps> = ({ careerGoal }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    const collectionName = CareerGoals.getCollectionName();
    const instance = careerGoal._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(Swal.fire({
        title: 'Career Goal Deleted',
        icon: 'success',
        text: 'Successfully deleted careerGoal.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        timer: 1500,
      }))
      .catch((error) => Swal.fire({
        title: 'Delete Failed',
        text: error.message,
        icon: 'error',
        // timer: 1500,
      }));
    setOpen(false);
  };

  return (
    <Modal key={`${careerGoal._id}-modal-delete`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<Button basic color='red' key={`${careerGoal._id}-edit-button`}>DELETE</Button>}>
      <Modal.Header>{`Delete careerGoal ${careerGoal.name}?`}</Modal.Header>
      <Modal.Content>Do you really want to delete the careerGoal &quot;{`${careerGoal.name}`}&quot; ?</Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={handleDelete}>YES</Button>
        <Button color='red' onClick={() => setOpen(false)}>NO</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteCareerGoalButton;
