import React, { useState } from 'react';
import { Accordion, Button, Confirm, Form, Icon, Message } from 'semantic-ui-react';
import { AutoForm, LongTextField, SelectField, SubmitField } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { Reviews } from '../../../api/review/ReviewCollection';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import RatingField from '../shared/RatingField';
import { IAcademicTerm, IReview, IReviewUpdate } from '../../../typings/radgrad';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { getUsername } from '../shared/RouterHelperFunctions';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { IReviewTypes, ReviewTypes } from '../../../api/review/ReviewTypes';

interface IStudentExplorerEditReviewWidgetProps {
  review: IReview;
  thisReview: object;
  event: {
    [key: string]: any;
  };
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
  };
}

const collection = Reviews;

const StudentExplorerEditReviewForm = (props: IStudentExplorerEditReviewWidgetProps) => {
  const formRef = React.createRef();
  const [activeState, setActive] = useState(false);
  const [confirmOpenState, setConfirmOpen] = useState(false);

  const handleAccordionClick = (e: any) => {
    e.preventDefault();
    setActive(!activeState);
  };

  const handleUpdate = (doc: IReviewUpdate): void => {
    const collectionName = collection.getCollectionName();
    const { match, review } = props;
    const username = getUsername(match);
    const academicTermDoc = AcademicTerms.getAcademicTermFromToString(doc.academicTerm);
    const academicTermSlug = AcademicTerms.findSlugByID(academicTermDoc._id);
    const updateData: IReviewUpdate = doc;
    updateData.academicTerm = academicTermSlug;
    updateData.moderated = false;
    updateData.id = review._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          icon: 'success',
          text: 'Your review was successfully edited.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        const reviewType: IReviewTypes = review.reviewType as IReviewTypes;
        let slug: string;
        if (reviewType === ReviewTypes.COURSE) {
          const revieweeID = Courses.getID(review.revieweeID);
          slug = Courses.findSlugByID(revieweeID);
        } else if (reviewType === ReviewTypes.OPPORTUNITY) {
          const revieweeID = Opportunities.getID(review.revieweeID);
          slug = Opportunities.findSlugByID(revieweeID);
        }
        const interactionData: UserInteractionsDataType = {
          username,
          type: UserInteractionsTypes.EDITREVIEW,
          typeData: [`${reviewType}:${updateData.academicTerm}-${slug}`],
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.error('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    });
  };

  const handleDelete = (e: any): void => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = (e: any): void => {
    e.preventDefault();
    const id = props.review._id;
    const collectionName = collection.getCollectionName();
    removeItMethod.call({ collectionName, instance: id }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting Review. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
        });
      }
      setConfirmOpen(false);
    });
  };

  const handleCancelDelete = (e: any): void => {
    e.preventDefault();
    setConfirmOpen(false);
  };

  const getUserIdFromRoute = (): string => {
    const username = getUsername(props.match);
    return username && Users.getID(username);
  };

  const academicTerm = (): IAcademicTerm[] => {
    const academicTerms = [];
    let instances;
    if (props.review.reviewType === ReviewTypes.COURSE) {
      const course = props.event;
      instances = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
    } else {
      const opportunity = props.event;
      instances = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
        verified: true,
      }).fetch();
    }
    _.forEach(instances, (instance) => {
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

  const { review } = props;

  const model: any = {};
  model.comments = review.comments;
  model.rating = review.rating;
  model.academicTerm = AcademicTerms.toString(review.termID, false);
  const terms = academicTerm();
  const academicTermNames = _.map(terms, (term) => `${term.term} ${term.year}`);
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
  return (
    <Accordion>
      <Accordion.Title style={accordionTitleStyle} active={activeState} onClick={handleAccordionClick}>
        <Icon name="dropdown" />
        <a>Edit Review </a>
        {
          review.moderated ? (
            <React.Fragment>
              {
                  review.visible ?
                    <i className="green checkmark icon" />
                    :
                    <i className="red warning circle icon" />
              }
            </React.Fragment>
            )
            : (
              <React.Fragment>
                {
                  review.visible ?
                    <i className="yellow checkmark icon" />
                    :
                    <i className="yellow warning circle icon" />
                }
              </React.Fragment>
            )
        }
      </Accordion.Title>

      <Accordion.Content active={activeState}>
        <div className="ui padded container" style={paddedContainerStyle}>
          {
            review.visible ? (
              <React.Fragment>
                {
                  review.moderated ? (
                    <Message positive>
                      <p>
                        <i className="green checkmark icon" />
                        Your post is visible to the RadGrad community and has
                        been approved by moderators.
                      </p>
                    </Message>
                    )
                      : (
                        <Message warning>
                          <p>
                            <i className="yellow checkmark icon" />
                            Your post is visible to the RadGrad community but has
                            not yet been approved by moderators.
                          </p>
                        </Message>
                      )
                  }
              </React.Fragment>
              )
              : (
                <React.Fragment>
                  {
                    review.moderated ? (
                      <Message negative>
                        <p>
                          <i className="warning red circle icon" />
                          Your post has been hidden by moderators for the
                          following reasons:
                        </p>
                        <br />
                        <i>{review.moderatorComments}</i>
                      </Message>
                      )
                      : (
                        <Message warning>
                          <p>
                            <i className="warning yellow circle icon" />
                            Your edited post is waiting for moderator
                            approval. Your post has currently been hidden by moderators for the following reasons:
                            <br />
                            <i>{review.moderatorComments}</i>
                          </p>
                        </Message>
                      )
                  }
                </React.Fragment>
              )
          }

          <AutoForm schema={schema} onSubmit={handleUpdate} ref={formRef} model={model}>
            <Form.Group widths="equal">
              <SelectField name="academicTerm" />
              <RatingField name="rating" />
            </Form.Group>

            <LongTextField name="comments" />

            <SubmitField className="green basic mini" value="UPDATE" disabled={false} inputRef={undefined} />
            <Button basic color="red" size="mini" onClick={handleDelete}>DELETE</Button>
            <Confirm
              open={confirmOpenState}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              header="Delete Review?"
            />
          </AutoForm>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

const StudentExplorerEditReviewFormContainer = withRouter(StudentExplorerEditReviewForm);

export default StudentExplorerEditReviewFormContainer;
