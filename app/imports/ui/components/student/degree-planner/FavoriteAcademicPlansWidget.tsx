import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import { Icon, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { AutoForm, SelectField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { IAcademicPlan } from '../../../../typings/radgrad';
import { getUsername, buildRouteName } from '../../shared/utilities/router';
import AcademicPlanViewerWidgetContainer from './AcademicPlanViewerWidget';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { FavoriteAcademicPlans } from '../../../../api/favorite/FavoriteAcademicPlanCollection';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import { Users } from '../../../../api/user/UserCollection';

interface IFavoriteAcademicPlansWidgetProps {
  plans: IAcademicPlan[];
}

const getPlan = (planName: string, props: IFavoriteAcademicPlansWidgetProps) => _.find(props.plans, (p) => p.name === planName);

const FavoriteAcademicPlansWidget = (props: IFavoriteAcademicPlansWidgetProps) => {
  const match = useRouteMatch();
  let plan;
  if (props.plans.length > 0) {
    plan = getPlan(props.plans[0].name, props);
  }
  const [selectedPlanState, setSelectedPlan] = useState(plan);

  const handleOnChangeModel = (model) => {
    const selectedPlan = getPlan(model.academicPlan, props);
    setSelectedPlan(selectedPlan);
  };

  const planNames = _.map(props.plans, (p) => p.name);

  const schema = new SimpleSchema({
    academicPlan: {
      type: String,
      allowedValues: planNames,
      defaultValue: planNames[0],
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const showPlanP = props.plans.length > 0;
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

export default withTracker((props) => {
  const { username } = useParams();
  const studentID = Users.getProfile(username).userID;
  const favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
  const plans = _.map(favorites, (fav) => AcademicPlans.findDoc(fav.academicPlanID));
  return {
    plans,
  };
})(FavoriteAcademicPlansWidget);
