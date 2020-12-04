import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteAcademicPlans } from '../../../../api/favorite/FavoriteAcademicPlanCollection';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { ROLE } from '../../../../api/role/Role';
import { Users } from '../../../../api/user/UserCollection';
import { IAcademicPlan, IFavoriteAcademicPlan, IHelpMessage } from '../../../../typings/radgrad';
import BackToTopButton from '../../../components/shared/BackToTopButton';
import AcademicPlanBrowserViewContainer from '../../../components/shared/explorer/browser-view/AcademicPlanBrowserView';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import * as Router from '../../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { getMenuWidget } from '../utilities/getMenuWidget';

interface IAcademicPlanBrowserViewPageProps {
  favoritePlans: IFavoriteAcademicPlan[];
  academicPlans: IAcademicPlan[];
  helpMessages: IHelpMessage[];
}

const AcademicPlanBrowserViewPage: React.FC<IAcademicPlanBrowserViewPageProps> = ({ academicPlans, favoritePlans, helpMessages }) => {
  const match = useRouteMatch();
  const favoriteAcademicPlans = _.map(favoritePlans, (f) => AcademicPlans.findDoc(f.academicPlanID));
  const menuAddedList = _.map(favoriteAcademicPlans, (p) => ({ item: p, count: 1 }));
  const role = Router.getRoleByUrl(match);
  const showFavorites = role === 'student';
  const columnWidth = showFavorites ? 12 : 16;
  return (
    <div id="academic-plan-browser-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {showFavorites ? (
              <Grid.Column width={4}>
                <ExplorerMultipleItemsMenu
                  menuAddedList={menuAddedList}
                  type={EXPLORER_TYPE.ACADEMICPLANS as IExplorerTypes}
                  menuCareerList={undefined}
                />
              </Grid.Column>
            ) : ' '}
            <Grid.Column width={columnWidth}>
              <AcademicPlanBrowserViewContainer favoritePlans={favoriteAcademicPlans} academicPlans={academicPlans} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <BackToTopButton />
      </Container>
    </div>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  // console.log(profile);
  const studentID = profile.userID;
  const favoritePlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const helpMessages = HelpMessages.findNonRetired({});
  let academicPlans;
  if (profile.declaredAcademicTermID) {
    const term = AcademicTerms.findDoc(profile.declaredAcademicTermID);
    academicPlans = AcademicPlans.findNonRetired({
      termNumbar: { $gte: term.termNumbar },
      year: { $gte: term.year },
    });
  } else if (profile.role === ROLE.STUDENT) {
    academicPlans = AcademicPlans.getLatestPlans();
  } else {
    academicPlans = AcademicPlans.findNonRetired({});
  }
  return {
    academicPlans,
    favoritePlans,
    helpMessages,
  };
})(AcademicPlanBrowserViewPage);
