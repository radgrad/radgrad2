import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { AcademicPlan, FavoriteAcademicPlan, HelpMessage } from '../../../../typings/radgrad';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import { Users } from '../../../../api/user/UserCollection';
import { FavoriteAcademicPlans } from '../../../../api/favorite/FavoriteAcademicPlanCollection';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import ExplorerPlanWidget from '../../../components/shared/explorer/item-view/academic-plan/ExplorerPlanWidget';

interface AcademicPlanViewPageProps {
  plan: AcademicPlan;
  favoriteAcademicPlans: FavoriteAcademicPlan[];
  helpMessages: HelpMessage[];
}

const AcademicPlanViewPage: React.FC<AcademicPlanViewPageProps> = ({ plan, favoriteAcademicPlans, helpMessages }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteAcademicPlans, (f) => ({
    item: AcademicPlans.findDoc(f.academicPlanID),
    count: 1,
  }));
  const descriptionPairs = [{ label: 'Description', value: `${plan.description}` }];
  return (
    <div id="academic-plan-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="plans" />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerPlanWidget name={plan.name} descriptionPairs={descriptionPairs} item={plan} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const AcademicPlanViewPageContainer = withTracker(() => {
  const { plan, username } = useParams();
  const planDoc = AcademicPlans.findDocBySlug(plan);
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  const favoriteAcademicPlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    favoriteAcademicPlans,
    helpMessages,
    plan: planDoc,
  };
})(AcademicPlanViewPage);

export default AcademicPlanViewPageContainer;
