import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import DateField from 'uniforms-semantic/DateField';
import NumberField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourse, IOpportunity, IStudentProfile } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { academicTermToName, courseToName, docToName, profileToName } from '../shared/AdminDataModelHelperFunctions';

interface IAddFeedFromProps {
  academicTerms: IAcademicTerm[];
  courses: ICourse[];
  opportunities: IOpportunity[];
  students: IStudentProfile[];
  formRef: any;
  handleAdd: (doc) => any;
}

interface IAddFeedFormState {
  feedType: string;
}

class AddFeedForm extends React.Component<IAddFeedFromProps, IAddFeedFormState> {
  constructor(props) {
    super(props);
    // console.log('AddFeedForm props=%o', props);
    this.state = { feedType: Feeds.NEW_USER };
  }

  private handleModelChange = (model) => {
    // console.log('change %o', model);
    const feedType = model.feedType;
    this.setState({ feedType });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const academicTermNames = _.map(this.props.academicTerms, academicTermToName);
    const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
    const courseNames = _.map(this.props.courses, courseToName);
    const opportunityNames = _.map(this.props.opportunities, docToName);
    const studentNames = _.map(this.props.students, profileToName);
    const feedTypes = [Feeds.NEW_COURSE, Feeds.NEW_COURSE_REVIEW, Feeds.NEW_LEVEL, Feeds.NEW_OPPORTUNITY, Feeds.NEW_OPPORTUNITY_REVIEW, Feeds.NEW_USER, Feeds.VERIFIED_OPPORTUNITY];
    const schema = new SimpleSchema({
      timestamp: { type: Date, optional: true },
      feedType: {
        type: String,
        allowedValues: feedTypes,
        defaultValue: feedTypes[5],
      },
    });
    const newCourseSchema = new SimpleSchema({
      course: { type: String, allowedValues: courseNames, defaultValue: courseNames[22], optional: true },
    });
    const newCourseReviewSchema = new SimpleSchema({
      course: { type: String, allowedValues: courseNames, defaultValue: courseNames[22], optional: true },
      user: { type: String, allowedValues: studentNames, defaultValue: studentNames[0], optional: true },
    });
    const newOpportunitySchema = new SimpleSchema({
      opportunity: {
        type: String,
        allowedValues: opportunityNames,
        defaultValue: opportunityNames[opportunityNames.length / 2],
        optional: true,
      },
    });
    const newOpportunityReviewSchema = new SimpleSchema({
      opportunity: { type: String, allowedValues: opportunityNames, optional: true },
      user: { type: String, allowedValues: studentNames, optional: true },
    });
    const newLevelSchema = new SimpleSchema({
      user: { type: String, allowedValues: studentNames, optional: true },
      level: { type: SimpleSchema.Integer, min: 1, max: 6, defaultValue: 1, optional: true },
    });
    const newUserSchema = new SimpleSchema({
      user: { type: String, allowedValues: studentNames, optional: true },
      picture: { type: String, optional: true },
    });
    const verifiedOpportunitySchema = new SimpleSchema({
      user: {
        type: String,
        allowedValues: studentNames,
        optional: true,
      },
      academicTerm: { type: String, allowedValues: academicTermNames, defaultValue: currentTermName, optional: true },
      opportunity: {
        type: String,
        allowedValues: opportunityNames,
        defaultValue: opportunityNames[opportunityNames.length / 2],
        optional: true,
      },
    });
    switch (this.state.feedType) {
      case Feeds.NEW_USER:
        schema.extend(newUserSchema);
        break;
      case Feeds.NEW_COURSE:
        schema.extend(newCourseSchema);
        break;
      case Feeds.NEW_COURSE_REVIEW:
        schema.extend(newCourseReviewSchema);
        break;
      case Feeds.NEW_LEVEL:
        schema.extend(newLevelSchema);
        break;
      case Feeds.NEW_OPPORTUNITY:
        schema.extend(newOpportunitySchema);
        break;
      case Feeds.NEW_OPPORTUNITY_REVIEW:
        schema.extend(newOpportunityReviewSchema);
        break;
      case Feeds.VERIFIED_OPPORTUNITY:
        schema.extend(verifiedOpportunitySchema);
        break;
      default:
    }
    // console.log(schema);
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Feed</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}
                  onChangeModel={this.handleModelChange}>
          <Form.Group widths="equal">
            <DateField name="timestamp"/>
            <SelectField name="feedType"/>
          </Form.Group>
          {this.state.feedType === Feeds.NEW_COURSE ? (
            <div>
              <Header dividing={true} as="h4">New course field</Header>
              <Form.Group widths="equal">
                <SelectField name="course"/>
              </Form.Group>
            </div>
          ) : ''}
          {this.state.feedType === Feeds.NEW_COURSE_REVIEW ? (
            <div>
              <Header dividing={true} as="h4">New course review fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <SelectField name="course"/>
              </Form.Group>
            </div>
          ) : ''}
          {this.state.feedType === Feeds.NEW_LEVEL ? (
            <div>
              <Header dividing={true} as="h4">New course review fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <NumberField name="level"/>
              </Form.Group>
            </div>
          ) : ''}
          {this.state.feedType === Feeds.NEW_OPPORTUNITY ? (
            <div>
              <Header dividing={true} as="h4">New opportunity field</Header>
              <Form.Group widths="equal">
                <SelectField name="opportunity"/>
              </Form.Group>
            </div>
          ) : ''}
          {this.state.feedType === Feeds.NEW_OPPORTUNITY_REVIEW ? (
            <div>
              <Header dividing={true} as="h4">New opportunity review fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <SelectField name="opportunity"/>
              </Form.Group>
            </div>
          ) : ''}
          {this.state.feedType === Feeds.NEW_USER ? (
            <div>
              <Header dividing={true} as="h4">New user fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <TextField name="picture" placeholder="No picture URL specified"/>
              </Form.Group>
            </div>
          ) : ''}
          {this.state.feedType === Feeds.VERIFIED_OPPORTUNITY ? (
            <div>
              <Header dividing={true} as="h4">New verified opportunity fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <SelectField name="opportunity"/>
                <SelectField name="academicTerm"/>
              </Form.Group>
            </div>
          ) : ''}
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddFeedFormContainer = withTracker((props) => {
  return {
    academicTerms: AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch(),
    courses: Courses.find({}, { sort: { num: 1 } }).fetch(),
    opportunities: Opportunities.find({}, { sort: { name: 1 } }).fetch(),
    students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
  };
})(AddFeedForm);

export default AddFeedFormContainer;
