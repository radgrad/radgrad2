import * as React from 'react';
import { Form, Tab } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import simplSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan } from '../../../typings/radgrad';

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

interface IAcademicPlanViewerState {
  academicPlan?: IAcademicPlan;
  name?: string;
  year?: number;
}

const ChooseSchema = new simplSchema({
  year: Number,
  name: String,
});

class AcademicPlanViewer extends React.Component<IAcademicPlanViewerProps, IAcademicPlanViewerState> {
  constructor(props) {
    super(props);
    console.log(props);
    this.submit = this.submit.bind(this);
    this.handleChangeYear = this.handleChangeYear.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.state = {};
  }

  private submit(data) {
    const { name, year } = data;
    console.log('Got %o from submit', { name, year });
  }

  private handleChangeYear(data) {
    console.log('change year %o', data);
  }

  private handleChangeName(data) {
    console.log('change name %o', data);
  }

  public render() {
    const username = this.props.match.params.username;
    const profile = Users.getProfile(username);
    let planYears = AcademicPlans.getPlanYears();
    // console.log(planYears);
    let plan;
    if (AcademicPlans.isDefined(profile.academicPlanID)) {
      plan = AcademicPlans.findDoc(profile.academicPlanID);
      // console.log(plan.year);
      planYears = _.filter(planYears, (p) => p >= plan.year);
    }
    // console.log(planYears);
    const names = [];
    _.forEach(planYears, (year) => {
      const plans = AcademicPlans.find({ year }).fetch();
      _.forEach(plans, (p) => names.push(p.name));
    });

    return (
      <div>
        <AutoForm schema={ChooseSchema} onSubmit={this.submit} model={plan}>
          <Form.Group widths="equal">
            <SelectField allowedValues={planYears} name="year" onChange={this.handleChangeYear}/>
            <SelectField allowedValues={names} name="name" onChange={this.handleChangeName}/>
            <SubmitField value="Choose this Plan"/>
          </Form.Group>
        </AutoForm>
      </div>
    );
  }

}

const AcademicPlanViewerContainer = withRouter(AcademicPlanViewer);
export default AcademicPlanViewerContainer;
