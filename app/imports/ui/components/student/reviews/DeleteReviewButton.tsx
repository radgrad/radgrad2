import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import RadGradAlert from '../../../utilities/RadGradAlert';
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
    // console.log('handleDelete', review);
    const collectionName = Reviews.getCollectionName();
    const instance = review._id;
    removeItMethod.callPromise({ collectionName, instance })
      .catch((error) => { RadGradAlert.failure('Delete Failed', error.message, error);})
      .then(() => {
        RadGradAlert.success('Review Deleted');
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
