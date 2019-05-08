import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IAddDesiredDegreeFormProps {
  formRef: any;
  handleAdd: (doc) => any;
}

class AddDesiredDegreeForm extends React.Component<IAddDesiredDegreeFormProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Course</Header>
        <AutoForm schema={DesiredDegrees.getDefineSchema()} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}>
          <Form.Group widths="equal">
            <TextField name="slug" placeholder="bs_science"/>
            <TextField name="name" placeholder="B.S. in Science"/>
            <TextField name="shortName" placeholder="B.S. S"/>
          </Form.Group>
          <LongTextField name="description"/>
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

export default AddDesiredDegreeForm;
