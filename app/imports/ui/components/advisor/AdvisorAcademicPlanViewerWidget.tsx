import * as React from 'react';
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
  selectedPlan?: IAcademicPlan;
}

class AdvisorAcademicPlanViewerWidget extends React.Component<IAdvisorAcademicPlanViewerWidgetProps, IAdvisorAcademicPlanViewerWidgetState> {
  constructor(props) {
    super(props);
    this.state = { planNames: [], selectedPlan: props.plans[0] };
  }

  private handleModelChange = (model) => {
    // console.log('change %o', model);
    const { year, name } = model;
    if (year) {
      const planNames = _.map(_.filter(this.props.plans, (p) => p.year === year), (plan) => plan.name);
      this.setState({ planNames, selectedPlan: undefined });
    } else {
      const selectedPlan = _.find(this.props.plans, (p) => p.name === name);
      // console.log('name change v=%o selected=%o', name, selectedPlan);
      this.setState({ selectedPlan });
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const years = _.uniq(_.map(this.props.plans, (p) => p.year));
    const names = years.length === 1 ? _.map(this.props.plans, (p) => p.name) : this.state.planNames;
    const schema = new SimpleSchema({
      year: { type: SimpleSchema.Integer, allowedValues: years },
      name: { type: String, allowedValues: names },
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
  return {
    plans,
  };
})(AdvisorAcademicPlanViewerWidget);

export default AdvisorAcademicPlanViewerWidgetContainer;
