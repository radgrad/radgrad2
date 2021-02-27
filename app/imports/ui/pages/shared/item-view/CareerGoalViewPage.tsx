import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { CareerGoal, DescriptionPair, FavoriteCareerGoal, Profile, SocialPair } from '../../../../typings/radgrad';
import { getMenuWidget } from '../utilities/getMenuWidget';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import ExplorerCareerGoalWidget from '../../../components/shared/explorer/item-view/career-goal/ExplorerCareerGoalWidget';
import { Interests } from '../../../../api/interest/InterestCollection';
import { teaser } from '../../../components/shared/explorer/item-view/utilities/teaser';
import { Users } from '../../../../api/user/UserCollection';
import { FavoriteCareerGoals } from '../../../../api/favorite/FavoriteCareerGoalCollection';
import { ROLE } from '../../../../api/role/Role';
import { profileGetCareerGoalIDs } from '../../../components/shared/utilities/data-model';
import { defaultProfilePicture } from '../../../../api/user/BaseProfileCollection';

interface CareerGoalViewPageProps {
  favoriteCareerGoals: FavoriteCareerGoal[];
  careerGoal: CareerGoal;
}

const interestedUsersCareerGoals = (theCareerGoal: CareerGoal, role: string): Profile[] => {
  let interested = [];
  const profiles = Users.findProfilesWithRole(role, {}, {});
  profiles.forEach((profile) => {
    if (_.includes(profileGetCareerGoalIDs(profile), theCareerGoal._id)) {
      interested.push(profile);
    }
  });
  interested = _.filter(interested, (profile) => profile.picture && profile.picture !== defaultProfilePicture);
  // only allow 50 students randomly selected.
  for (let i = interested.length - 1; i >= 50; i--) {
    interested.splice(Math.floor(Math.random() * interested.length), 1);
  }
  return interested;
};

const numUsersCareerGoals = (theCareerGoal: CareerGoal, role: string): number => interestedUsersCareerGoals(theCareerGoal, role).length;

const numStudentsCareerGoals = (theCareerGoal: CareerGoal): number => FavoriteCareerGoals.findNonRetired({ careerGoalID: theCareerGoal._id }).length;

const socialPairsCareerGoals = (theCareerGoal: CareerGoal): SocialPair[] => [
  {
    label: 'students',
    amount: numStudentsCareerGoals(theCareerGoal),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.STUDENT),
  },
  {
    label: 'faculty members',
    amount: numUsersCareerGoals(theCareerGoal, ROLE.FACULTY),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.FACULTY),
  },
  {
    label: 'advisor',
    amount: numUsersCareerGoals(theCareerGoal, ROLE.ADVISOR),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.ADVISOR),
  },
];

const CareerGoalViewPage: React.FC<CareerGoalViewPageProps> = ({ careerGoal, favoriteCareerGoals }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteCareerGoals, (f) => ({
    item: CareerGoals.findDoc(f.careerGoalID),
    count: 1,
  }));
  const descriptionPairs: DescriptionPair[] = [
    { label: 'Description', value: careerGoal.description },
    { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
    { label: 'Teaser', value: teaser(careerGoal) },
  ];
  const socialPairs = socialPairsCareerGoals(careerGoal);
  const pushDownStyle = { paddingTop: 15 };
  return (
    <div id="career-goal-view-page">
      {getMenuWidget(match)}
      <Container style={pushDownStyle}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="career-goals" />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerCareerGoalWidget name={careerGoal.name} descriptionPairs={descriptionPairs} item={careerGoal} socialPairs={socialPairs} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const CareerGoalViewPageContainer = withTracker(() => {
  const { careergoal, username } = useParams();
  const profile = Users.getProfile(username);
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: profile.userID });
  const careerGoalDoc = CareerGoals.findDocBySlug(careergoal);
  return {
    careerGoal: careerGoalDoc,
    favoriteCareerGoals,
  };
})(CareerGoalViewPage);

export default CareerGoalViewPageContainer;
