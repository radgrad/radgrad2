import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimplSchema from 'simpl-schema';
import _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import AcademicPlanViewerWidget from './AcademicPlanViewerWidget';

interface IAcademicPlanViewerProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const ChooseSchema = new SimplSchema({
  year: Number,
  name: String,
});
const formSchema = new SimpleSchema2Bridge(ChooseSchema);
const AcademicPlanViewer = (props: IAcademicPlanViewerProps) => {
  // console.log('AcademicPlanViewer', props);
  const username = props.match.params.username;
  const profile = Users.getProfile(username);
  let plan;
  if (AcademicPlans.isDefined(profile.academicPlanID)) {
    plan = AcademicPlans.findDoc(profile.academicPlanID);
  }
  const [planState, setPlan] = useState(plan);

  const submit = (data) => {
    const { name, year } = data;
    console.log('Got %o from submit', { name, year });
    // const academicPlan = AcademicPlans.find({ year, name }).fetch()[0];
  };

  const handleChangeYear = (data) => {
    // console.log('change year %o', data);
    const academicPlan = AcademicPlans.findNonRetired({ year: data, name: planState.name });
    if (academicPlan) {
      setPlan(academicPlan[0]);
    }
  };

  const handleChangeName = (data) => {
    // console.log('change name %o', data);
    const academicPlan = AcademicPlans.findNonRetired({ year: planState.year, name: data });
    if (academicPlan) {
      setPlan(academicPlan[0]);
    }
  };

  const planYears = AcademicPlans.getPlanYears();
  // console.log(planYears);
  const names = [];
  _.forEach(planYears, (year) => {
    const plans = AcademicPlans.findNonRetired({ year });
    _.forEach(plans, (p) => names.push(p.name));
  });
  const noBottomMargin = {
    marginBottom: 0,
  };
  return (
    <div>
      <AutoForm schema={formSchema} onSubmit={submit} model={plan}>
        <Form.Group style={noBottomMargin}>
          <SelectField allowedValues={planYears} name="year" onChange={handleChangeYear} width={4} />
          <SelectField allowedValues={names} name="name" onChange={handleChangeName} width={12} />
        </Form.Group>
        <br />
        <SubmitField value="Choose this Plan" className="" disabled={false} inputRef={undefined} />
      </AutoForm>
      <hr />
      <p />
      <AcademicPlanViewerWidget academicPlan={planState} username={props.match.params.username} />
    </div>
  );
};

const AcademicPlanViewerContainer = withRouter(AcademicPlanViewer);
export default AcademicPlanViewerContainer;
