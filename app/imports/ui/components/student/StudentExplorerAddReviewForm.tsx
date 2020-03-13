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
import { IAcademicTerm, IReviewDefine } from '../../../typings/radgrad';
import { USERINTERACTIONDATATYPE, USERINTERACTIONSTYPE } from '../../../api/analytic/UserInteractionsType';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { getUserIdFromRoute, getUsername } from '../shared/RouterHelperFunctions';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { ReviewTypes } from '../../../api/review/ReviewTypes';

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

  private handleAdd = (doc: IReviewDefine): void => {
    const collectionName = collection.getCollectionName();
    const { match, reviewType, event } = this.props;
    const username = getUsername(match);
    const academicTermDoc = AcademicTerms.getAcademicTermFromToString(doc.academicTerm);
    const academicTermSlug = AcademicTerms.findSlugByID(academicTermDoc._id);
    const definitionData: IReviewDefine = doc;
    definitionData.academicTerm = academicTermSlug;
    definitionData.student = username;
    definitionData.reviewType = reviewType as ReviewTypes;
    definitionData.reviewee = event._id;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add Failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Review Added',
          icon: 'success',
          text: 'Your review was successfully added.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        let slug: string;
        const reviewee = definitionData.reviewee;
        if (reviewType === ReviewTypes.COURSE) {
          const revieweeID = Courses.getID(reviewee);
          slug = Courses.findSlugByID(revieweeID);
        } else if (reviewType === ReviewTypes.OPPORTUNITY) {
          const revieweeID = Opportunities.getID(reviewee);
          slug = Opportunities.findSlugByID(revieweeID);
        }
        const interactionData: USERINTERACTIONDATATYPE = {
          username,
          type: USERINTERACTIONSTYPE.ADDREVIEW,
          typeData: [`${reviewType}:${academicTermSlug}-${slug}`],
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.log('Error creating UserInteraction.', userInteractionError);
          }
        });
        // this.formRef.current.reset();
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
