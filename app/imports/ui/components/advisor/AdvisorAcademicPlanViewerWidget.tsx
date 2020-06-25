import React, { useState } from 'react';
import _ from 'lodash';
import { Form, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicPlan } from '../../../typings/radgrad';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import AdvisorAcademicPlanViewer from './AdvisorAcademicPlanViewer';

interface IAdvisorAcademicPlanViewerWidgetProps {
  plans: IAcademicPlan[];
}

const AdvisorAcademicPlanViewerWidget = (props: IAdvisorAcademicPlanViewerWidgetProps) => {
  // console.log('AdvisorAcademicPlan props=%o', props);
  let planNames = _.map(_.filter(props.plans, (p) => p.year === props.plans[0].year), (plan) => plan.name);

  const [planNamesState, setPlanNames] = useState(planNames);
  const [selectedPlanState, setSelectedPlan] = useState(props.plans[0]);
  const [yearState, setYear] = useState(props.plans[0].year);

  const handleModelChange = (model) => {
    // console.log('model=%o', model);
    const { year, name } = model;
    const yearInt = parseInt(year, 10);
    const yearChanged = yearInt !== yearState;
    if (yearChanged) {
      planNames = _.map(_.filter(props.plans, (p) => p.year === yearInt), (plan) => plan.name);
      setPlanNames(planNames);
      setSelectedPlan(_.find(props.plans, (p) => p.name === planNames[0]));
      setYear(yearInt);
    } else {
      setSelectedPlan(_.find(props.plans, (p) => p.name === name));
    }
  };

  const years = _.uniq(_.map(props.plans, (p) => p.year));
  const schema = new SimpleSchema({
    year: { type: SimpleSchema.Integer, allowedValues: years, defaultValue: yearState },
    name: { type: String, allowedValues: planNamesState, defaultValue: planNamesState[0] },
  });
  return (
    <Segment padded>
      <AutoForm schema={schema} onChangeModel={handleModelChange}>
        <Form.Group widths="equal">
          <SelectField name="year" />
          <SelectField name="name" />
        </Form.Group>
        {selectedPlanState ? <AdvisorAcademicPlanViewer plan={selectedPlanState} /> : ''}
      </AutoForm>
    </Segment>
  );
};

const AdvisorAcademicPlanViewerWidgetContainer = withTracker(() => {
  const plans = AcademicPlans.findNonRetired();
  // console.log(plans);
  return {
    plans,
  };
})(AdvisorAcademicPlanViewerWidget);

export default AdvisorAcademicPlanViewerWidgetContainer;
