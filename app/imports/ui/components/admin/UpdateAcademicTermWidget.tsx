import * as React from 'react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import NumField from 'uniforms-semantic/NumField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { Form, Header, Segment } from 'semantic-ui-react';
import { IAcademicTerm } from '../../../typings/radgrad';

const UpdateAcademicTermSchema = new SimpleSchema({
  term: { type: String },
  year: { type: Number },
  retired: { type: Boolean, optional: true },
});

interface IUpdateAcademicTermProps {
  model: IAcademicTerm;
  handleCancel: (evt: any, inst: any) => any;
}

const updateTerm = (doc) => {
  console.log('updateTerm term=%o', doc);
};

class UpdateAcademicTermWidget extends React.Component<IUpdateAcademicTermProps> {
  constructor(props) {
    super(props);
  }

  private handleSubmit(evt, instance) {
    evt.preventDefault();
    console.log('handleSubmit instance=%o', instance);
  }

  public render(): React.ReactNode {
    return (
      <Segment padded={true}>
        <Header dividing={true} as="h4">UPDATE ACADEMIC TERM</Header>
        <AutoForm schema={UpdateAcademicTermSchema} onSubmit={updateTerm}>
          <Form.Group widths="equal">
            <TextField label="Term" name="term" value={this.props.model.term} disabled={true}/>
            <NumField label="Year" name="year" value={this.props.model.year} disabled={true}/>
          </Form.Group>
          <BoolField label="Retired" name="retired" value={this.props.model.retired}/>
          <Form.Group>
            <SubmitField name="update" value="Update"/>
            <SubmitField name="cancel" value="Cancel" onClick={this.props.handleCancel}/>
          </Form.Group>
        </AutoForm>
      </Segment>
    );
  }

}
export default UpdateAcademicTermWidget;
