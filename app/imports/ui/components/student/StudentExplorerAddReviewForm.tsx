import React from 'react';
import Swal from 'sweetalert2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, LongTextField, SelectField, SubmitField } from 'uniforms-semantic/';
import { Accordion, Form, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Reviews } from '../../../api/review/ReviewCollection';
import RatingField from '../shared/RatingField';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { IAcademicTerm } from '../../../typings/radgrad';
import { USERINTERACTIONDATATYPE, USERINTERACTIONSTYPE } from '../../../api/analytic/UserInteractionsType';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { getUserIdFromRoute, getUsername } from '../shared/RouterHelperFunctions';

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
    const { match, reviewType, event } = this.props;
    const username = getUsername(match);
    definitionData = this.renameKey(definitionData, 'academicTerm', 'termID');
    definitionData.student = username;
    definitionData.reviewType = reviewType;
    definitionData.reviewee = event._id;
    console.log('test1');
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add Failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        console.log('test2');
        Swal.fire({
          title: 'Review Added',
          icon: 'success',
          text: 'Your review was successfully added.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        console.log('test3');
        this.formRef.current.reset();
        const interactionData: USERINTERACTIONDATATYPE = {
          username,
          type: USERINTERACTIONSTYPE.REVIEWADD,
          typeData: [reviewType, 'tmp'],
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.log('Error creating UserInteraction.', userInteractionError);
          }
        });
        console.log('test4');
      }
    });
  }

  private academicTerm = (): IAcademicTerm[] => {
    const { match, event, reviewType } = this.props;
    const academicTerms = [];
    let instances;
    if (reviewType === 'course') {
      const course = event;
      instances = CourseInstances.find({
        studentID: getUserIdFromRoute(match),
        courseID: course._id,
      }).fetch();
    } else {
      const opportunity = event;
      instances = OpportunityInstances.find({
        studentID: getUserIdFromRoute(match),
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
          <Icon name="dropdown" />
          <a>Add Review </a>
        </Accordion.Title>

        <Accordion.Content active={active}>
          <div className="ui padded container" style={paddedContainerStyle}>
            <AutoForm schema={schema} onSubmit={this.handleAdd} ref={this.formRef}>
              <Form.Group widths="equal">
                <SelectField name="academicTerm" />
                <RatingField name="rating" />
              </Form.Group>

              <LongTextField placeholder="Explain the reasoning behind your rating here." name="comments" />

              <SubmitField className="green basic mini" value="ADD" inputRef={undefined} disabled={false} />
            </AutoForm>
          </div>
        </Accordion.Content>
      </Accordion>
    );
  }
}

const StudentExplorerAddReviewFormContainer = withRouter(StudentExplorerAddReviewForm);

export default StudentExplorerAddReviewFormContainer;
