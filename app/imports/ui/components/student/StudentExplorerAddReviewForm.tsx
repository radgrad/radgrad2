import * as React from 'react';
import Swal from 'sweetalert2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, LongTextField, SelectField, SubmitField } from 'uniforms-semantic/';
import { Accordion, Form, Icon } from 'semantic-ui-react';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Reviews } from '../../../api/review/ReviewCollection';
import RatingField from '../shared/RatingField';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

interface IStudentExplorerAddReviewFormProps {
  event: {
    [key: string]: any;
  }
  reviewType: string;
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

interface IStudentExplorerAddReviewFormState {
  active: boolean;
}

const collection = Reviews;

class StudentExplorerAddReviewForm extends React.Component<IStudentExplorerAddReviewFormProps, IStudentExplorerAddReviewFormState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      active: false,
    };
  }

  private getUsername = (): string => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
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

  private handleAdd = (doc: { [key: string]: any }): void => {
    const collectionName = collection.getCollectionName();
    let definitionData = doc;
    definitionData = this.renameKey(definitionData, 'academicTerm', 'termID');
    definitionData.student = this.getUsername();
    definitionData.reviewType = this.props.reviewType;
    definitionData.reviewee = this.props.event._id;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add Failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Review Added',
          type: 'success',
          text: 'Your review was successfully added.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        this.formRef.current.reset();
      }
    });
  }

  private academicTerm = (): object[] => {
    const academicTerms = [];
    let instances;
    if (this.props.reviewType === 'course') {
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

    const { active } = this.state;

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
        min: 0,
        max: 5,
        optional: true,
      },
      comments: {
        type: String,
        label: 'Comments',
      },
    });
    return (
      <Accordion>
        <Accordion.Title style={accordionTitleStyle} active={active} onClick={this.handleAccordionClick}>
          <Icon name="dropdown"/><a>Add Review </a>
        </Accordion.Title>

        <Accordion.Content active={active}>
          <div className="ui padded container" style={paddedContainerStyle}>
            <AutoForm schema={schema} onSubmit={this.handleAdd} ref={this.formRef}>
              <Form.Group widths="equal">
                <SelectField name="academicTerm"/>
                <RatingField name="rating"/>
              </Form.Group>

              <LongTextField placeholder='Explain the reasoning behind your rating here.' name="comments"/>

              <SubmitField className="green basic mini" value="ADD"/>
            </AutoForm>
          </div>
        </Accordion.Content>
      </Accordion>
    );
  }
}

const StudentExplorerAddReviewFormContainer = withRouter(StudentExplorerAddReviewForm);

export default StudentExplorerAddReviewFormContainer;
