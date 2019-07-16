import * as React from 'react';
import { Accordion, Button, Confirm, Form, Icon, Message } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import { AutoForm, LongTextField, SelectField, SubmitField } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { Reviews } from '../../../api/review/ReviewCollection';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import RatingField from '../shared/RatingField';

interface IStudentExplorerEditReviewWidgetProps {
  review: {
    [key: string]: any;
  };
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

interface IStudentExplorerEditReviewWidgetState {
  active: boolean;
  confirmOpen: boolean;
}

const collection = Reviews;

class StudentExplorerEditReviewForm extends React.Component<IStudentExplorerEditReviewWidgetProps, IStudentExplorerEditReviewWidgetState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      active: false,
      confirmOpen: false,
    };
  }

  private handleAccordionClick = (e: any) => {
    e.preventDefault();
    let { active } = this.state;
    active = !active;
    this.setState({ active });
  }

  private renameKey = (obj: object, oldKey: string, newKey: string): object => {
    const newObject = obj;
    newObject[newKey] = newObject[oldKey];
    delete newObject[oldKey];
    return newObject;
  }

  private handleUpdate = (doc: { [key: string]: any }): void => {
    const collectionName = collection.getCollectionName();
    let updateData = doc;
    updateData = this.renameKey(updateData, 'academicTerm', 'termID');
    updateData.termID = this.props.review.termID;
    updateData.moderated = false;
    updateData.id = this.props.review._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          type: 'success',
          text: 'Your review was successfully edited.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
  }

  private handleDelete = (e: any): void => {
    e.preventDefault();
    this.setState({ confirmOpen: true });
  }

  private handleConfirmDelete = (e: any): void => {
    e.preventDefault();
    const id = this.props.review._id;
    const collectionName = collection.getCollectionName();
    removeItMethod.call({ collectionName, instance: id }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error deleting Review. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          type: 'success',
        });
      }
      this.setState({ confirmOpen: false });
    });
  }

  private handleCancelDelete = (e: any): void => {
    e.preventDefault();
    this.setState({ confirmOpen: false });
  }

  private getUsername = (): string => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private academicTerm = (): object[] => {
    const academicTerms = [];
    let instances;
    if (this.props.review.reviewType === 'course') {
      const course = this.props.event;
      instances = CourseInstances.find({
        studentID: this.getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
    } else {
      const opportunity = this.props.event;
      instances = OpportunityInstances.find({
        studentID: this.getUserIdFromRoute(),
        opportunityID: opportunity._id,
      }).fetch();
    }
    _.forEach(instances, (instance) => {
      const term = AcademicTerms.findDoc(instance.termID);
      if (term.termNumber <= AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
        academicTerms.push(AcademicTerms.findDoc(instance.termID));
      }
    });
    return academicTerms;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const accordionTitleStyle = {
      textAlign: 'center',
      color: '#38840F',
    };
    const paddedContainerStyle = { paddingBottom: '1.5em' };

    const { review } = this.props;
    const { active, confirmOpen } = this.state;

    const academicTerm = this.academicTerm();
    const academicTermNames = _.map(academicTerm, (term) => `${term.term} ${term.year}`);
    const schema = new SimpleSchema({
      academicTerm: {
        type: String,
        label: 'Academic Term',
        allowedValues: academicTermNames,
        defaultValue: academicTermNames[0],
      },
      rating: {
        type: Number,
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
        <Accordion.Title style={accordionTitleStyle} active={active} onClick={this.handleAccordionClick}>
          <Icon name="dropdown"/><a>Edit Review </a>
          {
            review.moderated ?
              <React.Fragment>
                {
                  review.visible ?
                    <i className="green checkmark icon"/>
                    :
                    <i className="red warning circle icon"/>
                }
              </React.Fragment>
              :
              <React.Fragment>
                {
                  review.visible ?
                    <i className="yellow checkmark icon"/>
                    :
                    <i className="yellow warning circle icon"/>
                }
              </React.Fragment>
          }
        </Accordion.Title>

        <Accordion.Content active={active}>
          <div className="ui padded container" style={paddedContainerStyle}>
            {
              review.visible ?
                <React.Fragment>
                  {
                    review.moderated ?
                      <Message positive={true}>
                        <p><i className="green checkmark icon"/>Your post is visible to the RadGrad community and has
                          been approved by moderators.</p>
                      </Message>
                      :
                      <Message warning={true}>
                        <p><i className="yellow checkmark icon"/>Your post is visible to the RadGrad community but has
                          not yet been approved by moderators.</p>
                      </Message>
                  }
                </React.Fragment>
                :
                <React.Fragment>
                  {
                    review.moderated ?
                      <Message negative={true}>
                        <p><i className="warning red circle icon"/>Your post has been hidden by moderators for the
                          following reasons:</p>
                        <br/>
                        <i>{review.moderatorComments}</i>
                      </Message>
                      :
                      <Message warning={true}>
                        <p>
                          <i className="warning yellow circle icon"/>Your edited post is waiting for moderator
                          approval. Your post has currently been hidden by moderators for the following reasons:
                          <br/>
                          <i>{review.moderatorComments}</i>
                        </p>
                      </Message>
                  }
                </React.Fragment>
            }

            <AutoForm schema={schema} onSubmit={this.handleUpdate} ref={this.formRef}>
              <Form.Group widths="equal">
                <SelectField name="academicTerm"/>
                <RatingField name="rating"/>
              </Form.Group>

              <LongTextField name="comments"/>

              <SubmitField className="green basic mini" value="UPDATE"/>
              <Button basic={true} color="red" size="mini" onClick={this.handleDelete}>DELETE</Button>
              <Confirm open={confirmOpen} onCancel={this.handleCancelDelete} onConfirm={this.handleConfirmDelete}
                       header="Delete Review?"/>
            </AutoForm>
          </div>
        </Accordion.Content>
      </Accordion>
    );
  }
}

const StudentExplorerEditReviewFormContainer = withRouter(StudentExplorerEditReviewForm);

export default StudentExplorerEditReviewFormContainer;
