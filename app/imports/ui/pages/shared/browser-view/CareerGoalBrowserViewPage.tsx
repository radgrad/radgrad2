import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { FavoriteCareerGoals } from '../../../../api/favorite/FavoriteCareerGoalCollection';
import { ROLE } from '../../../../api/role/Role';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal, StudentProfileUpdate } from '../../../../typings/radgrad';
import CareerGoalBrowserViewContainer from '../../../components/shared/explorer/browser-view/CareerGoalBrowserView';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import PageLayout from '../../PageLayout';

interface CareerGoalBrowserViewPageProps {
  favoriteCareerGoals: CareerGoal[];
  favoriteCombinedInterestIDs: string[];
  careerGoals: CareerGoal[];
}

const headerPaneTitle = 'Find your career goals';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Specify at least three career goals so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a career goal of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;

const CareerGoalBrowserViewPage: React.FC<CareerGoalBrowserViewPageProps> = ({
  favoriteCareerGoals,
  favoriteCombinedInterestIDs,
  careerGoals,
}) => {
  const menuAddedList = _.map(favoriteCareerGoals, (f) => ({ item: f, count: 1 }));
  return (
    <PageLayout id="career-goal-browser-view-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <ExplorerMultipleItemsMenu menuAddedList={menuAddedList} type={EXPLORER_TYPE.CAREERGOALS as IExplorerTypes}
                                       menuCareerList={undefined} />
          </Grid.Column>
          <Grid.Column width={12}>
            <CareerGoalBrowserViewContainer favoriteCareerGoals={favoriteCareerGoals}
                                            favoriteCombinedInterestIDs={favoriteCombinedInterestIDs}
                                            careerGoals={careerGoals} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  if (profile.role === ROLE.STUDENT) {
    const lastVisited = moment().format('YYYY-MM-DD');
    if (lastVisited !== profile.lastVisitedCareerGoals) {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = profile._id;
      updateData.lastVisitedCareerGoals = lastVisited;
      updateMethod.call({ collectionName, updateData }, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  }
  const favCar = FavoriteCareerGoals.findNonRetired({ userID: profile.userID });
  const favoriteCareerGoals = _.map(favCar, (f) => CareerGoals.findDoc(f.careerGoalID));
  const favoriteCombinedInterestIDs = Users.getInterestIDs(username);
  const careerGoals = CareerGoals.findNonRetired({});
  return {
    careerGoals,
    favoriteCareerGoals,
    favoriteCombinedInterestIDs,
  };
})(CareerGoalBrowserViewPage);
