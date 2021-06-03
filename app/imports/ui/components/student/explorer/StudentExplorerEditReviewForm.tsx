import React, { useState } from 'react';
import { Accordion, Button, Confirm, Form, Icon, Message } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useRouteMatch } from 'react-router-dom';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { removeItMethod, updateMethod } from '../../../../api/base/BaseCollection.methods';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { Users } from '../../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import RatingField from './RatingField';
import { AcademicTerm, Review, ReviewUpdate } from '../../../../typings/radgrad';
import { getUsername } from '../../shared/utilities/router';
import { ReviewTypes } from '../../../../api/review/ReviewTypes';
import RadGradAlert from '../../../utilities/RadGradAlert';

interface StudentExplorerEditReviewWidgetProps {
  review: Review;
  itemToReview: any;
}

const collection = Reviews;

const StudentExplorerEditReviewForm: React.FC<StudentExplorerEditReviewWidgetProps> = ({ review, itemToReview }) => {
  const formRef = React.createRef();
  const [activeState, setActive] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const match = useRouteMatch();

  const handleAccordionClick = (e: any) => {
    e.preventDefault();
    setActive(!activeState);
  };

  const handleUpdate = (doc: ReviewUpdate): void => {
    const collectionName = collection.getCollectionName();
    const academicTermDoc = AcademicTerms.getAcademicTermFromToString(doc.academicTerm);
    const academicTermSlug = AcademicTerms.findSlugByID(academicTermDoc._id);
    const updateData: ReviewUpdate = doc;
    updateData.academicTerm = academicTermSlug;
    updateData.moderated = false;
    updateData.visible = false;
    updateData.id = review._id;
    updateMethod.callPromise({ collectionName, updateData })
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);})
      .then(() => { RadGradAlert.success('Update Succeeded');});
  };

  const handleDelete = (e: any): void => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = (e: any): void => {
    e.preventDefault();
    const id = review._id;
    const collectionName = collection.getCollectionName();
    removeItMethod.callPromise({ collectionName, instance: id })
      .catch((error) => { RadGradAlert.failure('Delete failed', error.message, error);})
      .then(() => { RadGradAlert.success('Delete succeeded');});
    setConfirmOpen(false);
  };

  const handleCancelDelete = (e: any): void => {
    e.preventDefault();
    setConfirmOpen(false);
  };

  const getUserIdFromRoute = (): string => {
    const username = getUsername(match);
    return username && Users.getID(username);
  };

  const academicTerm = (): AcademicTerm[] => {
    const academicTerms = [];
    let instances;
    if (review.reviewType === ReviewTypes.COURSE) {
      const course = itemToReview;
      instances = CourseInstances.findNonRetired({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      });
    } else {
      const opportunity = itemToReview;
      instances = OpportunityInstances.findNonRetired({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
        verified: true,
      });
    }
    instances.forEach((instance) => {
      const term = AcademicTerms.findDoc(instance.termID);
      if (term.termNumber <= AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
        academicTerms.push(AcademicTerms.findDoc(instance.termID));
      }
    });
    return academicTerms;
  };

  const accordionTitleStyle = {
    textAlign: 'center',
    color: '#38840F',
  };
  const paddedContainerStyle = { paddingBottom: '1.5em' };
  const model: any = {};
  model.comments = review.comments;
  model.rating = review.rating;
  model.academicTerm = AcademicTerms.toString(review.termID, false);
  const terms = academicTerm();
  const academicTermNames = terms.map((term) => `${term.term} ${term.year}`);
  const schema = new SimpleSchema({
    academicTerm: {
      type: String,
      label: 'Academic Term',
      allowedValues: academicTermNames,
      defaultValue: academicTermNames[0],
    },
    rating: {
      type: SimpleSchema.Integer,
      label: 'Rating',
      defaultValue: review.rating,
      min: 0,
      max: 5,
      optional: true,
    },
    comments: {
      type: String,
      label: 'Comments',
      defaultValue: review.comments,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Accordion>
      <Accordion.Title style={accordionTitleStyle} active={activeState} onClick={handleAccordionClick}>
        <Icon name="dropdown" />
        <a>Edit Review </a>
        {review.moderated ? (
          <React.Fragment>{review.visible ? <i className="green checkmark icon" /> :
            <i className="red warning circle icon" />}</React.Fragment>
        ) : (
          <React.Fragment>{review.visible ? <i className="yellow checkmark icon" /> :
            <i className="yellow warning circle icon" />}</React.Fragment>
        )}
      </Accordion.Title>

      <Accordion.Content active={activeState}>
        <div className="ui padded container" style={paddedContainerStyle}>
          {review.moderated ? (
            <React.Fragment>
              {review.visible ? (
                <Message positive>
                  <p>
                    <i className="green checkmark icon" />
                    Your post is visible to the RadGrad community and has been approved by
                    moderators.
                  </p>
                </Message>
              ) : (
                <Message negative>
                  <p>
                    <i className="warning red circle icon" />
                    Your post has been hidden by moderators for the following reasons:
                  </p>
                  <br />
                  <i>{review.moderatorComments}</i>
                </Message>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Message warning>
                <p>
                  <i className="warning yellow circle icon" />
                  Your review is waiting for moderator approval.
                  <br />
                </p>
              </Message>
            </React.Fragment>
          )}

          <AutoForm schema={formSchema} onSubmit={handleUpdate} ref={formRef} model={model}>
            <Form.Group widths="equal">
              {academicTermNames.length <= 1 ? <SelectField name="academicTerm" disabled /> : <SelectField name="academicTerm" />}
              <RatingField name="rating" />
            </Form.Group>

            <LongTextField name="comments" />

            <SubmitField className="green basic mini" value="UPDATE" disabled={false} inputRef={undefined} />
            <Button basic color="red" size="mini" onClick={handleDelete}>
              DELETE
            </Button>
            <Confirm open={confirmOpenState} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} header="Delete Review?" />
            <ErrorsField />
          </AutoForm>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

export default StudentExplorerEditReviewForm;
