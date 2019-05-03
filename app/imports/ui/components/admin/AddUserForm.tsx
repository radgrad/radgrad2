import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumberField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../../api/interest/InterestCollection';
import { ICareerGoal, IInterest } from '../../../typings/radgrad';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { ROLES, ROLE } from '../../../api/role/Role';

interface IAddUserProps {
  interests: IInterest[];
  careerGoals: ICareerGoal[];
  formRef: any;
  handleAdd: (doc) => any;
}

interface IAddUserState {
  role: string;
}

class AddUserForm extends React.Component<IAddUserProps, IAddUserState> {
  constructor(props) {
    super(props);
    // console.log('AddUserForm props=%o', props);
    this.state = { role: '' };
  }

  private handleModelChange = (model) => {
    console.log('change %o', model);
    const role = model.role;
    this.setState({ role });
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // console.log(this.props);
    const interestNames = _.map(this.props.interests, (interest) => interest.name);
    const careerGoalNames = _.map(this.props.careerGoals, (careerGoal) => careerGoal.name);
    const roles = [ROLE.ADVISOR, ROLE.FACULTY, ROLE.MENTOR, ROLE.STUDENT];
    const schema = new SimpleSchema({
      'username': String,
      'firstName': String,
      'lastName': String,
      'role': {
        type: String,
        allowedValues: roles,
        defaultValue: roles[3],
      },
      'picture': { type: String, optional: true },
      'website': { type: String, optional: true },
      'interests': { type: Array, optional: true },
      'interests.$': {
        type: String,
        allowedValues: interestNames,
      },
      'careerGoals': { type: Array, optional: true },
      'careerGoals.$': {
        type: String,
        allowedValues: careerGoalNames,
      },
    });
    const mentorSchema = new SimpleSchema({
      company: { type: String, optional: true },
      career: { type: String, optional: true },
      location: { type: String, optional: true },
      linkedin: { type: String, optional: true },
      motivation: { type: String, optional: true },
    });
    const studentSchema = new SimpleSchema({
      level: { type: SimpleSchema.Integer, optional: true, min: 1, max: 6, defaultValue: 1 },
      declaredAcademicTerm: { type: String, optional: true },
      academicPlan: { type: String, optional: true },
      isAlumni: { type: Boolean, optional: true },
    });
    if (this.state.role === ROLE.MENTOR) {
      schema.extend(mentorSchema);
    }
    if (this.state.role === ROLE.STUDENT) {
      schema.extend(studentSchema);
    }
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add User</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}
                  onChangeModel={this.handleModelChange}>
          <Form.Group widths="equal">
            <TextField name="username" placeholder="johndoe@foo.edu"/>
            <SelectField name="role"/>
          </Form.Group>
          <Form.Group widths="equal">
            <TextField name="firstName" placeholder="John"/>
            <TextField name="lastName" placeholder="Doe"/>
          </Form.Group>
          <Header dividing={true} as="h4">Optional fields (all users)</Header>
          <Form.Group widths="equal">
            <TextField name="picture" placeholder="http://johndoe.github.io/images/johndoe.jpg"/>
            <TextField name="website" placeholder="http://johndoe.github.io/"/>
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="interests"/>
            <SelectField name="careerGoals"/>
          </Form.Group>
          {this.state.role === ROLE.MENTOR ? <Header dividing={true} as="h4">Mentor fields</Header> : ''}
          {this.state.role === ROLE.STUDENT ? (
            <div>
              <Header dividing={true} as="h4">Student fields</Header>
              <Form.Group widths="equal">
                <NumberField name="level"/>
                <TextField name="declaredAcademicTerm"/>
                <TextField name="academicPlan"/>
              </Form.Group>
            </div>
          ) : ''}
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddUserFormContainter = withTracker((props) => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  return {
    interests,
    careerGoals,
  };
})(AddUserForm);

export default AddUserFormContainter;
