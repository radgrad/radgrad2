import * as React from 'react';
import AutoForm from 'uniforms-semantic/AutoForm';
import NumField from 'uniforms-semantic/NumField';
import RadioField from 'uniforms-semantic/RadioField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { Form, Header, Segment } from 'semantic-ui-react';
import { IAcademicTerm } from '../../../typings/radgrad';
import { ROLE } from '../../../api/role/Role';
import SelectUserField from '../form-fields/SelectUserField';
import FormExampleSubcomponentControl from './FormExampleSubcomponentControl';

const UpdateAcademicTermSchema = new SimpleSchema({
  id: { type: String, optional: true },
  term: { type: String },
  year: { type: Number },
  retired: { type: Boolean, optional: true },
});

interface IUpdateAcademicTermProps {
  model: IAcademicTerm;
  handleCancel: (evt: any, inst: any) => any;
  handleUpdate: (doc: any) => any;
}

class UpdateAcademicTermWidget extends React.Component<IUpdateAcademicTermProps> {
  constructor(props) {
    super(props);
    this.updateTerm = this.updateTerm.bind(this);
  }

  private updateTerm(doc) {
    console.log('handleSubmit instance=%o', doc);
    // this.props.handleUpdate(doc);
  }

  public render(): React.ReactNode {
    // tslint:disable:jsx-no-lambda
    return (
      <Segment padded={true}>
        <Header dividing={true}>UPDATE ACADEMIC TERM</Header>
        <AutoForm schema={UpdateAcademicTermSchema} onSubmit={this.updateTerm} model={this.props.model}>
          <Form.Group widths="equal">
            <TextField label="Term" name="term" value={this.props.model.term} disabled={true}/>
            <NumField label="Year" name="year" value={this.props.model.year} disabled={true}/>
          </Form.Group>
          <RadioField allowedValues={[true, false]} label="Retired" name="retired"
                      transform={(value) => `${value}`}/>
          <Form.Group>
            <SubmitField name="update" value="Update" className="ui basic green button"/>
            <SubmitField name="cancel" value="Cancel" className="ui basic green button"
                         onClick={this.props.handleCancel}/>
          </Form.Group>
        </AutoForm>
        <AutoForm schema={new SimpleSchema({
          advisor: String,
          student: String,
        })} onSubmit={this.updateTerm}>
          <SelectUserField label="Advisor" name="advisor" role={ROLE.ADVISOR} required={true}/>
          <SelectUserField label="Student" name="student" role={ROLE.STUDENT} required={false}/>
          <SubmitField/>
        </AutoForm>
        <FormExampleSubcomponentControl handleSubmit={this.updateTerm}/>
      </Segment>
    );
  }

}

export default UpdateAcademicTermWidget;
