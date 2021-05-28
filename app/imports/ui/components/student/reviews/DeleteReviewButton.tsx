import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Review } from '../../../../typings/radgrad';
import { getRevieweeName } from './utilities/review-name';

interface DeleteReviewButtonProps {
  review: Review;
}

const DeleteReviewButton: React.FC<DeleteReviewButtonProps> = ({ review }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    console.log('handleDelete', review);
    const collectionName = Reviews.getCollectionName();
    const instance = review._id;
    removeItMethod.callPromise({ collectionName, instance })
      .catch((error) => {
        Swal.fire({
          title: 'Delete Failed',
          text: error.message,
          icon: 'error',
          timer: 1500,
        });
      }).then(() => {
        Swal.fire({
          title: 'Review Deleted',
          icon: 'success',
          text: 'Your review was successfully deleted.',
          timer: 1500,
        });
        setOpen(false);
      });
  };

  const itemName = getRevieweeName(review);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='red'>DELETE</Button>}
    >
      <Modal.Header>Delete your review?</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete your review of {itemName}?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleDelete}>YES</Button>
        <Button color='red' onClick={() => setOpen(false)}>NO</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteReviewButton;
