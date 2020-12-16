import React from 'react';
import _ from 'lodash';
import { useRouteMatch, Link } from 'react-router-dom';
import { Grid, Segment, Header, Icon, Label, Divider, Button } from 'semantic-ui-react';
import {
  FavoriteAcademicPlan,
  FavoriteCareerGoal,
  FavoriteInterest,
  StudentProfile,
} from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import StudentAboutMeUpdatePictureForm from './StudentAboutMeUpdatePictureForm';
import StudentShareInfoWidget from './StudentShareInfoWidget';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import StudentAboutMeUpdateWebsiteForm from './StudentAboutMeUpdateWebsiteForm';
import * as Router from '../../shared/utilities/router';
import {
  itemToSlugName,
  profileToFullName,
} from '../../shared/utilities/data-model';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';

interface StudentAboutMeWidgetProps {
  profile: StudentProfile;
  favoriteCareerGoals: FavoriteCareerGoal[];
  favoriteInterests: FavoriteInterest[];
  favoriteAcademicPlans: FavoriteAcademicPlan[];
}

const StudentAboutMeWidget: React.FC<StudentAboutMeWidgetProps> = ({ profile, favoriteInterests, favoriteCareerGoals, favoriteAcademicPlans }) => {
  const marginBottomStyle = { marginBottom: 0 };
  const match = useRouteMatch();
  const name = profileToFullName(profile);
  const email = profile.username;
  const careerGoals = _.map(favoriteCareerGoals, (f) => CareerGoals.findDoc(f.careerGoalID));
  const interests = _.map(favoriteInterests, (f) => Interests.findDoc(f.interestID));
  const academicPlans = _.map(favoriteAcademicPlans, (f) => AcademicPlans.findDoc(f.academicPlanID));
  const labelStyle = { marginBottom: '2px' };
  const favorites = { color: '#53A78F', marginLeft: 10 };
  return (
    <>
      <Header as="h1">About me</Header>
      <Segment padded className="test">
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}><strong>NAME: </strong></Grid.Column>
            <Grid.Column width={8}>{name}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}><strong>EMAIL: </strong></Grid.Column>
            <Grid.Column width={8}>{email}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}><strong>PROFILE PICTURE: </strong></Grid.Column>
            <Grid.Column width={8}>
              <StudentAboutMeUpdatePictureForm
                picture={profile.picture}
                docID={profile._id}
                collectionName={StudentProfiles.getCollectionName()}
              /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}><strong>WEBSITE: </strong></Grid.Column>
            <Grid.Column width={8}>
              <StudentAboutMeUpdateWebsiteForm
                website={profile.website}
                docID={profile._id}
                collectionName={StudentProfiles.getCollectionName()}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Header as="h1">Share your Information with others</Header>
      <Segment padded>
        <Grid>
          <Grid.Row>
            <StudentShareInfoWidget profile={profile} />
          </Grid.Row>
        </Grid>
      </Segment>

      <Header as="h1">My Favorites</Header>
      <Segment padded>
        <Grid>
          <Grid.Row>
            <Header as="h2" style={favorites}>
              <Icon name="briefcase" />
              <Header.Content>My Favorite Career Goals</Header.Content>
            </Header>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={11}>            {careerGoals.length !== 0 ?
              careerGoals.map((careerGoal) => {
                const slugName = itemToSlugName(careerGoal);
                const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slugName}`);
                return (
                  <Label style={labelStyle} key={careerGoal._id} as={Link} to={route} size="tiny">
                    <Icon name="suitcase" fitted /> {careerGoal.name}
                  </Label>
                );
              })
              :
              <p style={marginBottomStyle}>No career goals favorited yet.</p>}</Grid.Column>
            <Grid.Column textAlign="right" width={5}>
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`)}>
                <Button basic color="green" content="VIEW MORE" />
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column style={marginBottomStyle}>
              <Divider />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Header as="h2" style={favorites}>
              <Icon name="favorite" />
              <Header.Content>My Favorite Interests</Header.Content>
            </Header>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={11}>
              {interests.length !== 0 ?
                interests.map((interest) => {
                  const slugName = itemToSlugName(interest);
                  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slugName}`);
                  return (
                    <Label style={labelStyle} key={interest._id} as={Link} to={route} size="tiny">
                      <Icon name="star" fitted /> {interest.name}
                    </Label>
                  );
                })
                :
                <p style={marginBottomStyle}>No interests favorited yet.</p>}
            </Grid.Column>
            <Grid.Column width={5} textAlign="right">
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`)}>
                <Button basic color="green" content="VIEW MORE" />
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column style={marginBottomStyle}>
              <Divider />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Header as="h2" style={favorites}>
              <Icon name="graduation cap" />
              <Header.Content>My Favorite Academic Plan</Header.Content>
            </Header>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={11}>
              {academicPlans.length !== 0 ?
                academicPlans.map((plan) => {
                  const slugName = itemToSlugName(plan);
                  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${slugName}`);
                  return (
                    <Label style={labelStyle} key={plan._id} as={Link} to={route} size="tiny">
                      <Icon name="map outline" fitted /> {plan.name}
                    </Label>
                  );
                })
                :
                <p style={marginBottomStyle}>No academic plans favorited yet.</p>}
            </Grid.Column>
            <Grid.Column textAlign="right" width={5}>
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`)}>
                <Button basic color="green" content="VIEW MORE" />
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
};

export default StudentAboutMeWidget;
