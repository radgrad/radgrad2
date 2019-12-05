import * as React from 'react';
import * as _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import MultiSelectField from '../shared/MultiSelectField';
import { Interests } from '../../../api/interest/InterestCollection';
import { IInterest } from '../../../typings/radgrad'; // eslint-disable-line
import { docToName } from '../shared/data-model-helper-functions';

interface IAddCareerGoalFormProps {
  interests: IInterest[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddCareerGoalForm = (props: IAddCareerGoalFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  // console.log(props);
  const interestNames = _.map(props.interests, docToName);
  const schema = new SimpleSchema({
    name: String,
    slug: String,
    description: String,
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
  });
  return (
    <Segment padded={true}>
      <Header dividing={true}>Add Career Goal</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError={true}>
        <Form.Group widths="equal">
          <TextField name="name" placeholder="Software Engineer"/>
          <TextField name="slug" placeholder="software-engineer"/>
        </Form.Group>
        <MultiSelectField name="interests" placeholder="Select interest(s)"/>
        <LongTextField name="description" placeholder="Describe the Career Goal here"/>
        <SubmitField className="basic green" value="Add"/>
      </AutoForm>
    </Segment>
  );
};

const AddCareerGoalFormContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  return {
    interests,
  };
})(AddCareerGoalForm);

export default AddCareerGoalFormContainer;
