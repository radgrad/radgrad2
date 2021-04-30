import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Opportunity } from '../../../../typings/radgrad';

interface DeleteOpportunityButtonProps {
  opportunity: Opportunity;
}

const DeleteOpportunityButton: React.FC<DeleteOpportunityButtonProps> = ({ opportunity }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    const collectionName = Opportunities.getCollectionName();
    const instance = opportunity._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(Swal.fire({
        title: 'Opportunity Deleted',
        icon: 'success',
        text: 'Successfully deleted opportunity.',
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
    <Modal key={`${opportunity._id}-modal-delete`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<Button basic color='red' key={`${opportunity._id}-edit-button`}>DELETE</Button>}>
      <Modal.Header>{`Delete opportunity ${opportunity.name}?`}</Modal.Header>
      <Modal.Content>Do you really want to delete the opportunity &quot;{`${opportunity.name}`}&quot; ?</Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={handleDelete}>YES</Button>
        <Button color='red' onClick={() => setOpen(false)}>NO</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteOpportunityButton;
