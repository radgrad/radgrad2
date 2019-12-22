import * as React from 'react';
import { Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import SimplSchema from 'simpl-schema';
import * as _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line
import AcademicPlanViewerWidget from './AcademicPlanViewerWidget';

interface IAcademicPlanViewerProps {
  match: IRadGradMatch;
}

interface IAcademicPlanViewerState {
  academicPlan?: IAcademicPlan;
  name?: string;
  year?: number;
}

const ChooseSchema = new SimplSchema({
  year: Number,
  name: String,
});

class AcademicPlanViewer extends React.Component<IAcademicPlanViewerProps, IAcademicPlanViewerState> {
  constructor(props) {
    super(props);
    // console.log(props);
    const username = props.match.params.username;
    const profile = Users.getProfile(username);
    let plan;
    if (AcademicPlans.isDefined(profile.academicPlanID)) {
      plan = AcademicPlans.findDoc(profile.academicPlanID);
    }
    if (plan) {
      this.state = {
        year: plan.year,
        name: plan.name,
        academicPlan: plan,
      };
    } else {
      this.state = {};
    }
  }

  private submit = (data) => {
    const { name, year } = data;
    console.log('Got %o from submit', { name, year });
    // const academicPlan = AcademicPlans.find({ year, name }).fetch()[0];
  }

  private handleChangeYear = (data) => {
    console.log('change year %o', data);
    const academicPlan = AcademicPlans.find({ year: data, name: this.state.name }).fetch()[0];
    if (academicPlan) {
      this.setState({
        year: academicPlan.year,
        name: academicPlan.name,
        academicPlan,
      });
    }
  }

  private handleChangeName = (data) => {
    console.log('change name %o', data);
    const academicPlan = AcademicPlans.find({ year: this.state.year, name: data }).fetch()[0];
    if (academicPlan) {
      this.setState({
        year: academicPlan.year,
        name: academicPlan.name,
        academicPlan,
      });
    }
  }

  public render() {
    const planYears = AcademicPlans.getPlanYears();
    const plan = this.state.academicPlan;
    // console.log(planYears);
    const names = [];
    _.forEach(planYears, (year) => {
      const plans = AcademicPlans.find({ year }).fetch();
      _.forEach(plans, (p) => names.push(p.name));
    });
    const noBottomMargin = {
      marginBottom: 0,
    };
    return (
      <div>
        <AutoForm schema={ChooseSchema} onSubmit={this.submit} model={plan}>
          <Form.Group style={noBottomMargin}>
            <SelectField allowedValues={planYears} name="year" onChange={this.handleChangeYear} width={4} />
            <SelectField allowedValues={names} name="name" onChange={this.handleChangeName} width={12} />
          </Form.Group>
          <br />
          <SubmitField value="Choose this Plan" className="" disabled={false} inputRef={undefined} />
        </AutoForm>
        <hr />
        <p />
        <AcademicPlanViewerWidget academicPlan={this.state.academicPlan} username={this.props.match.params.username} />
      </div>
    );
  }

}

const AcademicPlanViewerContainer = withRouter(AcademicPlanViewer);
export default AcademicPlanViewerContainer;
