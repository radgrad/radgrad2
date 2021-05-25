import React, { useState } from 'react';
import { Button, Grid, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, LongTextField, SubmitField } from 'uniforms-semantic';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Review, ReviewUpdate } from '../../../../typings/radgrad';
import RatingField from '../explorer/RatingField';
import { getRevieweeName } from './utilities/review-name';

interface EditReviewButtonProps {
  review: Review;
}

/**
 * Edit review button. Pops up a modal that allows the user to edit the given review.
 * @param {Review} review the Review.
 * @return {any}
 * @constructor
 */
const EditReviewButton: React.FC<EditReviewButtonProps> = ({ review }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (doc) => {
    const updateData: ReviewUpdate = {};
    updateData.id = review._id;
    updateData.rating = doc.rating;
    updateData.comments = doc.comments;
    const collectionName = Reviews.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          icon: 'error',
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: 'Review Updated',
          icon: 'success',
          text: 'Your review was successfully updated.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setOpen(false);
    });
  };
  const itemName = getRevieweeName(review);
  const reviewSchema = new SimpleSchema({
    rating: {
      type: SimpleSchema.Integer,
      label: 'Rating',
      min: 0,
      max: 5,
      optional: true,
      defaultValue: 3,
    },
    comments: {
      type: String,
      label: 'Comments',
      optional: true,
    },
  });
  const reviewFormSchema = new SimpleSchema2Bridge(reviewSchema);
  return (<Modal
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
    trigger={<Button basic color='green'>EDIT</Button>}
    >
      <Modal.Header>{`Edit your review of ${itemName}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={review} schema={reviewFormSchema} onSubmit={handleSubmit}>
          <Grid>
            <Grid.Column width={6} verticalAlign='middle'>
              Rate your overall satisfaction.
            </Grid.Column>
            <Grid.Column width={10}>
              <RatingField name='rating' />
            </Grid.Column>
            <Grid.Column width={6} verticalAlign='middle'>
              Please provide three or four sentences discussing your experience. Please use language your parents
              would
              find appropriate :)
            </Grid.Column>
            <Grid.Column width={10}>
              <LongTextField name='comments' />
            </Grid.Column>
            <Grid.Column width={6}>
              <SubmitField />
              <Button color='red' onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Grid.Column>
          </Grid>
            <ErrorsField/>
        </AutoForm>
      </Modal.Content>
  </Modal>
  );
};

export default EditReviewButton;
