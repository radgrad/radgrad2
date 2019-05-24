import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import { IAcademicTerm, IOpportunity, IOpportunityInstance, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import {
  academicTermToName,
  docToName,
  opportunityInstanceToName,
  profileToName,
} from '../shared/AdminDataModelHelperFunctions';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

interface IAddVerificationRequestFormProps {
  students: IStudentProfile[];
  academicTerms: IAcademicTerm[];
  opportunities: IOpportunity[];
  opportunityInstances: IOpportunityInstance[];
  formRef: any;
  handleAdd: (doc) => any;
}

class AddVerificationRequestForm extends React.Component<IAddVerificationRequestFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddVerificationRequestForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const termNames = _.map(this.props.academicTerms, academicTermToName);
    const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
    const opportunityNames = _.map(this.props.opportunities, docToName);
    const opportunityInstanceNames = _.map(this.props.opportunityInstances, opportunityInstanceToName);
    const studentNames = _.map(this.props.students, profileToName);
    const schema = new SimpleSchema({
      student: { type: String, allowedValues: studentNames },
      status: {
        type: String,
        optional: true,
        allowedValues: [VerificationRequests.OPEN, VerificationRequests.ACCEPTED, VerificationRequests.REJECTED],
      },
      academicTerm: { type: String, optional: true, allowedValues: termNames, defaultValue: currentTermName },
      opportunityInstance: { type: String, optional: true, allowedValues: opportunityInstanceNames },
      opportunity: { type: String, optional: true, allowedValues: opportunityNames },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Verification Request</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}>
          <Form.Group widths="equal">
            <SelectField name="student" placeholder="Choose the student"/>
            <SelectField name="status" placeholder="Choose the status"/>
          </Form.Group>
          <Form.Group widths="equal">
            <SelectField name="opportunityInstance"/>
            <SelectField name="opportunity"/>
            <SelectField name="academicTerm"/>
          </Form.Group>
          <BoolField name="retired"/>
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddVerificationRequestFormContainer = withTracker(() => {
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  const opportunityInstances = OpportunityInstances.find().fetch();
  return {
    students,
    academicTerms,
    opportunities,
    opportunityInstances,
  };
})(AddVerificationRequestForm);

export default AddVerificationRequestFormContainer;
