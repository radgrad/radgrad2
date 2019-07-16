import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import BoolField from 'uniforms-semantic/BoolField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicTerm } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { academicTermIdToName, academicTermToName } from '../shared/AdminDataModelHelperFunctions';
import { iceSchema } from '../../../api/ice/IceProcessor';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

interface IUpdateCourseInstanceFormProps {
  terms: IAcademicTerm[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateCourseInstanceForm extends React.Component<IUpdateCourseInstanceFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateCourseInstanceForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.collection.findDoc(this.props.id);
    model.academicTerm = academicTermIdToName(model.termID);
    model.creditHours = model.creditHrs;
    // console.log(model);
    const termNames = _.map(this.props.terms, academicTermToName);
    const schema = new SimpleSchema({
      academicTerm: {
        type: String,
        allowedValues: termNames,
      },
      ice: iceSchema,
      verified: { type: Boolean, optional: true },
      fromRegistrar: { type: Boolean, optional: true },
      creditHours: {
        type: SimpleSchema.Integer,
        optional: true,
      },
      grade: {
        type: String,
        allowedValues: CourseInstances.validGrades,
        optional: true,
      },
      note: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <SelectField name="academicTerm"/>
            <AutoField name="ice"/>
          </Form.Group>
          <Form.Group widths="equal">
            <BoolField name="verified"/>
            <BoolField name="fromRegistrar"/>
          </Form.Group>
          <Form.Group>
            <NumField name="creditHours"/>
            <SelectField name="grade"/>
            <TextField name="note"/>
          </Form.Group>
          <BoolField name="retired"/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateCourseInstanceFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    terms,
  };
})(UpdateCourseInstanceForm);

export default UpdateCourseInstanceFormContainer;
