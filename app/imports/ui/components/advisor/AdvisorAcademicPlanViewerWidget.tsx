import React from 'react';
import _ from 'lodash';
import { Form, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField } from 'uniforms-semantic';
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
    // console.log('AdvisorAcademicPlan props=%o', props);
  }

  private handleModelChange = (model) => {
    // console.log('model=%o state=%o', model, this.state);
    const { year, name } = model;
    const yearInt = parseInt(year, 10);
    const yearChanged = yearInt !== this.state.year;
    const newState: any = {};
    if (yearChanged) {
      newState.planNames = _.map(_.filter(this.props.plans, (p) => p.year === yearInt), (plan) => plan.name);
      newState.year = yearInt;
      newState.selectedPlan = _.find(this.props.plans, (p) => p.name === newState.planNames[0]);
    } else {
      newState.selectedPlan = _.find(this.props.plans, (p) => p.name === name);
    }
    // console.log('newState = %o', newState);
    this.setState(newState);
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const years = _.uniq(_.map(this.props.plans, (p) => p.year));
    const schema = new SimpleSchema({
      year: { type: SimpleSchema.Integer, allowedValues: years, defaultValue: this.state.year },
      name: { type: String, allowedValues: this.state.planNames, defaultValue: this.state.planNames[0] },
    });
    // console.log('APV render state', this.state);
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
  // console.log(plans);
  return {
    plans,
  };
})(AdvisorAcademicPlanViewerWidget);

export default AdvisorAcademicPlanViewerWidgetContainer;
