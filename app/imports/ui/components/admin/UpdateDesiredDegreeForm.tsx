import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import { _ } from 'meteor/erasaur:meteor-lodash'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line

interface IUpdateDesiredDegreeFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateDesiredDegreeForm extends React.Component<IUpdateDesiredDegreeFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateDesiredDegree props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.collection.findDoc(this.props.id);
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm
          ref={this.props.formRef}
          schema={this.props.collection.getUpdateSchema()}
          model={model}
          onSubmit={this.props.handleUpdate}>
          <Form.Group widths="equal">
            <TextField name="name"/>
            <TextField name="shortName"/>
          </Form.Group>
          <LongTextField name="description"/>
          <BoolField name="retired"/>
          <p/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

export default UpdateDesiredDegreeForm;
