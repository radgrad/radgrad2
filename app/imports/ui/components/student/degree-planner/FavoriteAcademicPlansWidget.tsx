import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import { Icon, Message } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { AutoForm, SelectField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { IAcademicPlan } from '../../../../typings/radgrad';
import { getUsername, buildRouteName } from '../../shared/utilities/router';
import AcademicPlanViewerWidgetContainer from './AcademicPlanViewerWidget';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface IFavoriteAcademicPlansWidgetProps {
  plans: IAcademicPlan[];
  takenSlugs: string[];
}

const getPlan = (planName: string, plans: IAcademicPlan[]) => _.find(plans, (p) => p.name === planName);

const FavoriteAcademicPlansWidget: React.FC<IFavoriteAcademicPlansWidgetProps> = ({ plans, takenSlugs }) => {
  const match = useRouteMatch();
  let plan;
  if (plans.length > 0) {
    plan = getPlan(plans[0].name, plans);
  }
  const [selectedPlanState, setSelectedPlan] = useState(plan);

  const handleOnChangeModel = (model) => {
    const selectedPlan = getPlan(model.academicPlan, plans);
    setSelectedPlan(selectedPlan);
  };

  const planNames = _.map(plans, (p) => p.name);

  const schema = new SimpleSchema({
    academicPlan: {
      type: String,
      allowedValues: planNames,
      defaultValue: planNames[0],
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const showPlanP = plans.length > 0;
  return (
    <div>
      <AutoForm schema={formSchema} onChangeModel={handleOnChangeModel}>
        <SelectField name="academicPlan" label="Academic Plans" />
      </AutoForm>
      <p />
      {showPlanP ?
        (
          <AcademicPlanViewerWidgetContainer
            academicPlan={selectedPlanState}
            username={getUsername(match)}
            takenSlugs={takenSlugs}
          />
        )
        :
        (
          <Message info>
            <Message.Header>No Favorite Academic Plans</Message.Header>
            <p>You can favorite academic plans in the explorer.</p>
            <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`)}>
              View in Explorer <Icon name="arrow right" />
            </Link>
          </Message>
        )}
    </div>
  );
};

export default FavoriteAcademicPlansWidget;
