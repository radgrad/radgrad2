import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { ICareerGoal, ICourse, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { docToName, docToSlugNameAndType } from '../shared/AdminDataModelHelperFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import MultiSelectField from '../shared/MultiSelectField';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';

interface IAddTeaserFormProps {
  careerGoals: ICareerGoal[];
  courses: ICourse[];
  interests: IInterest[];
  opportunities: IOpportunity[];
  formRef: any;
  handleAdd: (doc) => any;
}

class AddTeaserForm extends React.Component<IAddTeaserFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddTeaserForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const interestNames = _.map(this.props.interests, docToName);
    const opportunitySlugs = _.map(this.props.opportunities, docToSlugNameAndType);
    const courseSlugs = _.map(this.props.courses, docToSlugNameAndType);
    const interestSlugs = _.map(this.props.interests, docToSlugNameAndType);
    const careerGoalSlugs = _.map(this.props.careerGoals, docToSlugNameAndType);
    const schema = new SimpleSchema({
      title: String,
      slug: String,
      author: String,
      youtubeID: String,
      description: String,
      duration: String,
      interests: {
        type: Array,
      },
      'interests.$': {
        type: String,
        allowedValues: interestNames,
      },
      targetSlug: { type: String, allowedValues: opportunitySlugs.concat(courseSlugs.concat(interestSlugs.concat(careerGoalSlugs))) },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Teaser</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}>
          <Form.Group widths="equal">
            <TextField name="title"/>
            <TextField name="slug"/>
            <TextField name="author"/>
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="targetSlug"/>
            <TextField name="youtubeID"/>
            <TextField name="duration"/>
          </Form.Group>
          <MultiSelectField name="interests"/>
          <LongTextField name="description"/>
          <BoolField name="retired"/>
          <SubmitField className="basic green" value="Add"/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddTeaserFormContainer = withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  const interests = Interests.findNonRetired({}, { sort: { name: 1 } });
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(AddTeaserForm);

export default AddTeaserFormContainer;
