import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import AdvisorAcademicPlanViewer from './AdvisorAcademicPlanViewer';


interface IAdvisorAcademicPlanViewerWidgetProps {
  plans: IAcademicPlan[];
}

interface IAdvisorAcademicPlanViewerWidgetState {
  planNames: string[];
  year: number;
  selectedPlan?: IAcademicPlan;
}

class AdvisorAcademicPlanViewerWidget extends React.Component<IAdvisorAcademicPlanViewerWidgetProps, IAdvisorAcademicPlanViewerWidgetState> {
  constructor(props) {
    super(props);
    const year = props.plans[0].year;
    const planNames = _.map(_.filter(this.props.plans, (p) => p.year === year), (plan) => plan.name);
    this.state = { planNames, selectedPlan: props.plans[0], year };
    console.log('AdvisorAcademicPlan props=%o', props);
  }

  private handleModelChange = (model) => {
    console.log('model=%o state=%o', model, this.state);
    const { year, name } = model;
    const yearInt = parseInt(year, 10);
    if (yearInt !== this.state.year) {
      const planNames = _.map(_.filter(this.props.plans, (p) => p.year === yearInt), (plan) => plan.name);
      console.log(planNames);
      this.setState({ planNames });
    }
    if (name) {
      const selectedPlan = _.find(this.props.plans, (p) => p.name === name);
      // console.log('name change v=%o selected=%o', name, selectedPlan);
      this.setState({ selectedPlan });
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const years = _.uniq(_.map(this.props.plans, (p) => p.year));
    const schema = new SimpleSchema({
      year: { type: SimpleSchema.Integer, allowedValues: years, defaultValue: years[0] },
      name: { type: String, allowedValues: this.state.planNames, defaultValue: this.state.planNames[0] },
    });
    return (
      <Segment padded={true}>
        <AutoForm schema={schema} onChangeModel={this.handleModelChange}>
          <Form.Group widths="equal">
            <SelectField name="year"/>
            <SelectField name="name"/>
          </Form.Group>
          {this.state.selectedPlan ? <AdvisorAcademicPlanViewer plan={this.state.selectedPlan}/> : ''}
        </AutoForm>
      </Segment>
    );
  }
}

const AdvisorAcademicPlanViewerWidgetContainer = withTracker(() => {
  const plans = AcademicPlans.findNonRetired();
  console.log(plans);
  return {
    plans,
  };
})(AdvisorAcademicPlanViewerWidget);

export default AdvisorAcademicPlanViewerWidgetContainer;
