import React from 'react';
import SimpleSchema from 'simpl-schema';
import { Icon, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { AutoForm, SelectField } from 'uniforms-semantic';
import { IAcademicPlan } from '../../../typings/radgrad';
import * as Router from '../shared/RouterHelperFunctions';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import AcademicPlanViewerWidgetContainer from './AcademicPlanViewerWidget';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';

interface IFavoriteAcademicPlansWidgetProps {
  match: Router.IMatchProps;
  studentID: string;
  plans: IAcademicPlan[];
}

interface IFavoriteAcademicPlansWidgetState {
  selectedPlan: IAcademicPlan;
}

const getPlan = (planName: string, props: IFavoriteAcademicPlansWidgetProps) => _.find(props.plans, (p) => p.name === planName);

class FavoriteAcademicPlansWidget extends React.Component<IFavoriteAcademicPlansWidgetProps, IFavoriteAcademicPlansWidgetState> {
  constructor(props) {
    super(props);
    let plan;
    if (this.props.plans.length > 0) {
      plan = getPlan(this.props.plans[0].name, this.props);
    }
    this.state = { selectedPlan: plan };
  }

  private handleOnChangeModel = (model) => {
    // console.log(model);
    const selectedPlan = getPlan(model.academicPlan, this.props);
    this.setState({ selectedPlan });
  }

  public render() {
    const planNames = _.map(this.props.plans, (plan) => plan.name);
    const schema = new SimpleSchema({
      academicPlan: {
        type: String,
        allowedValues: planNames,
      },
    });
    const showPlanP = this.props.plans.length > 0;
    return (
      <div>
        <AutoForm schema={schema} onChangeModel={this.handleOnChangeModel}>
          <SelectField name="academicPlan" />
        </AutoForm>
        <p />
        {showPlanP ? (
          <AcademicPlanViewerWidgetContainer
            academicPlan={this.state.selectedPlan}
            username={Router.getUsername(this.props.match)}
          />
        )
          : (
            <Message info>
              <Message.Header>No favorite acadmeic plans</Message.Header>
              <p>
You can favorite academic plans in the explorer.
                <Link to={Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`)}>
View
                in
                Explorer
                  <Icon name="arrow right" />
                </Link>
              </p>
            </Message>
        )}
      </div>
    );
  }
}

export default withRouter(withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
  const plans = _.map(favorites, (fav) => AcademicPlans.findDoc(fav.academicPlanID));
  return {
    studentID,
    plans,
  };
})(FavoriteAcademicPlansWidget));
