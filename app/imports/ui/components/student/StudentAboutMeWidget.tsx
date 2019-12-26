import React from 'react';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Container, Grid, Segment, Header, Icon, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../../api/user/UserCollection';
import {
  ICareerGoal, IFavoriteAcademicPlan, // eslint-disable-line
  IFavoriteCareerGoal, // eslint-disable-line
  IFavoriteInterest, // eslint-disable-line
  IInterest, IRadGradMatch, // eslint-disable-line
  IStudentProfile // eslint-disable-line
} from '../../../typings/radgrad'; // eslint-disable-line
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import StudentAboutMeUpdatePictureForm from './StudentAboutMeUpdatePictureForm';
import StudentShareInfoWidget from './StudentShareInfoWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import StudentAboutMeUpdateWebsiteForm from './StudentAboutMeUpdateWebsiteForm';
import * as Router from '../shared/RouterHelperFunctions';
import {
  itemToSlugName,
  profileToFullName,
} from '../shared/data-model-helper-functions';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { studentAboutMeWidget } from './student-widget-names';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

interface IStudentAboutMeWidgetProps {
  match: IRadGradMatch;
  profile: IStudentProfile;
  favoriteCareerGoals: IFavoriteCareerGoal[];
  favoriteInterests: IFavoriteInterest[];
  favoriteAcademicPlans: IFavoriteAcademicPlan[];
}

const StudentAboutMeWidget = (props: IStudentAboutMeWidgetProps) => {
  const marginBottomStyle = { marginBottom: 0 };

  const { match, profile, favoriteAcademicPlans, favoriteCareerGoals, favoriteInterests } = props;
  const name = profileToFullName(profile);
  const email = props.profile.username;
  const interests = _.map(favoriteInterests, (f) => Interests.findDoc(f.interestID));
  const careerGoals = _.map(favoriteCareerGoals, (f) => CareerGoals.findDoc(f.careerGoalID));
  const academicPlans = _.map(favoriteAcademicPlans, (f) => AcademicPlans.findDoc(f.academicPlanID));
  return (
    <Segment padded id={`${studentAboutMeWidget}`}>
      <Container>
        <Header as="h4" dividing>ABOUT ME</Header>

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={2}><b>Name</b></Grid.Column>
            <Grid.Column width={6}>{name}</Grid.Column>

            <Grid.Column width={2}><b>Email</b></Grid.Column>
            <Grid.Column width={6}>{email}</Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <StudentAboutMeUpdatePictureForm
              picture={props.profile.picture}
              docID={props.profile._id}
              collectionName={StudentProfiles.getCollectionName()}
            />
            <StudentAboutMeUpdateWebsiteForm
              website={props.profile.website}
              docID={props.profile._id}
              collectionName={StudentProfiles.getCollectionName()}
            />
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2}><p><b>My Favorite Career Goals</b></p></Grid.Column>
            <Grid.Column width={6}>
              {careerGoals.length !== 0 ?
                  careerGoals.map((careerGoal) => {
                    const slugName = itemToSlugName(careerGoal);
                    const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slugName}`);
                    return (
                      <Label key={careerGoal._id} as={Link} to={route} size="tiny">
                        <Icon name="suitcase" fitted />
                        {' '}
                        {careerGoal.name}
                      </Label>
                    );
                  })
                  :
                  <p style={marginBottomStyle}>No career goals favorited yet.</p>}
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`)}>
                <p>View More Career Goals</p>
              </Link>
            </Grid.Column>

            <Grid.Column width={2}><p><b>My Favorite Interests</b></p></Grid.Column>
            <Grid.Column width={6}>
              {interests.length !== 0 ?
                interests.map((interest) => {
                  const slugName = itemToSlugName(interest);
                  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slugName}`);
                  return (
                    <Label key={interest._id} as={Link} to={route} size="tiny">
                      <Icon name="star" fitted />
                      {' '}
                      {interest.name}
                    </Label>
                  );
                })
                :
                <p style={marginBottomStyle}>No interests favorited yet.</p>}
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`)}>
                <p>Update in interest explorer</p>
              </Link>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2}><p><b>My Favorite Academic Plan</b></p></Grid.Column>
            <Grid.Column width={6}>
              {academicPlans.length !== 0 ?
                  academicPlans.map((plan) => {
                    const slugName = itemToSlugName(plan);
                    const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${slugName}`);
                    return (
                      <Label key={plan._id} as={Link} to={route} size="tiny">
                        <Icon name="map outline" fitted />
                        {' '}
                        {plan.name}
                      </Label>
                    );
                  })
                  :
                  <p style={marginBottomStyle}>No academic plans favorited yet.</p>}
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`)}>
                  Update in academic plan explorer
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <StudentShareInfoWidget profile={profile} />
      </Container>
    </Segment>
  );
};

export default withRouter(withTracker((props) => {
  const profile = Users.getProfile(props.match.params.username);
  const favoriteAcademicPlans = FavoriteAcademicPlans.findNonRetired({ studentID: profile.userID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: profile.userID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ userID: profile.userID });
  return {
    profile,
    favoriteAcademicPlans,
    favoriteCareerGoals,
    favoriteInterests,
  };
})(StudentAboutMeWidget));
