import * as React from 'react';
import * as _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourse, IOpportunity, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { academicTermToName, courseToName, docToName, profileToName } from '../shared/data-model-helper-functions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Reviews } from '../../../api/review/ReviewCollection';

interface IAddReviewFormProps {
  terms: IAcademicTerm[];
  courses: ICourse[];
  students: IStudentProfile[];
  opportunities: IOpportunity[];
  formRef: any;
  handleAdd: (doc) => any;
}

interface IAddReviewFormState {
  reviewType: string;
}

class AddReviewForm extends React.Component<IAddReviewFormProps, IAddReviewFormState> {
  constructor(props) {
    super(props);
    // console.log('AddReviewForm props=%o', props);
    this.state = { reviewType: '' };
  }

  private handleModelChange = (model) => {
    // console.log('change %o', model);
    const reviewType = model.reviewType;
    this.setState({ reviewType });
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const termNames = _.map(this.props.terms, academicTermToName);
    const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
    const courseNames = _.map(this.props.courses, courseToName);
    const opportunityNames = _.map(this.props.opportunities, docToName);
    const reviewTypes = [Reviews.COURSE, Reviews.OPPORTUNITY];
    let revieweeNames;
    if (this.state.reviewType === Reviews.COURSE) {
      revieweeNames = courseNames;
    } else {
      revieweeNames = opportunityNames;
    }
    const studentNames = _.map(this.props.students, profileToName);
    const schema = new SimpleSchema({
      slug: String,
      academicTerm: {
        type: String,
        allowedValues: termNames,
        defaultValue: currentTermName,
      },
      reviewee: {
        type: String,
        allowedValues: revieweeNames,
        defaultValue: revieweeNames[0],
      },
      student: {
        type: String,
        allowedValues: studentNames,
        defaultValue: studentNames[0],
      },
      reviewType: { type: String, allowedValues: reviewTypes, defaultValue: Reviews.COURSE },
      rating: { type: SimpleSchema.Integer, min: 0, max: 5, optional: true },
      comments: String,
      moderated: { type: Boolean, optional: true },
      visible: { type: Boolean, optional: true },
      moderatorComments: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded>
        <Header dividing>Add Course Instance</Header>
        <AutoForm
          schema={schema}
          onSubmit={this.props.handleAdd}
          ref={this.props.formRef}
          showInlineError
          onChangeModel={this.handleModelChange}
        >
          <Form.Group widths="equal">
            <TextField name="slug" />
            <SelectField name="reviewType" />
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="student" />
            <SelectField name="reviewee" />
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="academicTerm" />
            <NumField name="rating" />
          </Form.Group>
          <LongTextField name="comments" />
          <Form.Group>
            <BoolField name="moderated" />
            <BoolField name="visible" />
          </Form.Group>
          <LongTextField name="moderatorComments" />
          <BoolField name="retired" />
          <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
        </AutoForm>
      </Segment>
    );
  }
}

const AddReviewFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find().fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  return {
    terms,
    courses,
    students,
    opportunities,
  };
})(AddReviewForm);

export default AddReviewFormContainer;
