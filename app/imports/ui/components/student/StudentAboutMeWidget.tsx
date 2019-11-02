import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Grid, Segment, Header, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../../api/user/UserCollection';
import { ICareerGoal, IInterest, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import StudentAboutMeUpdatePictureForm from './StudentAboutMeUpdatePictureForm';
import StudentShareInfoWidget from './StudentShareInfoWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import StudentAboutMeUpdateWebsiteForm from './StudentAboutMeUpdateWebsiteForm';
import * as Router from '../shared/RouterHelperFunctions';
import {
  itemToSlugName, profileGetCareerGoals, profileGetDesiredDegreeName, profileGetInterests,
  profileToFullName,
} from '../shared/data-model-helper-functions';

interface IStudentAboutMeWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: IStudentProfile;
}

const StudentAboutMeWidget = (props: IStudentAboutMeWidgetProps) => {
  const marginBottomStyle = { marginBottom: 0 };

  const { match, profile } = props;
  const name = profileToFullName(profile);
  const email = props.profile.username;
  const careerGoals = profileGetCareerGoals(props.profile);
  const interests = profileGetInterests(props.profile);
  const desiredDegree = profileGetDesiredDegreeName(props.profile);
  return (
    <Segment padded={true}>
      <Container>
        <Header as="h4" dividing={true}>ABOUT ME</Header>

        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={2}><b>Name</b></Grid.Column>
            <Grid.Column width={6}>{name}</Grid.Column>

            <Grid.Column width={2}><b>Email</b></Grid.Column>
            <Grid.Column width={6}>{email}</Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <StudentAboutMeUpdatePictureForm picture={props.profile.picture}
                                             docID={props.profile._id}
                                             collectionName={StudentProfiles.getCollectionName()}/>
            <StudentAboutMeUpdateWebsiteForm website={props.profile.website}
                                             docID={props.profile._id}
                                             collectionName={StudentProfiles.getCollectionName()}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2}><p><b>Career Goals</b></p></Grid.Column>
            <Grid.Column width={6}>
              {careerGoals.length !== 0 ?
                careerGoals.map((careerGoal) => {
                  const slugName = itemToSlugName(careerGoal);
                  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slugName}`);
                  return (
                    <Label key={careerGoal._id} as={Link} to={route} size="tiny">
                      <i className="fitted suitcase"/> {careerGoal.name}
                    </Label>
                  );
                })
                :
                <p style={marginBottomStyle}>No career goals added yet.</p>
              }
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`)}>
                <p>View More Career Goals</p>
              </Link>
            </Grid.Column>

            <Grid.Column width={2}><p><b>Interests</b></p></Grid.Column>
            <Grid.Column width={6}>
              {interests.length !== 0 ?
                interests.map((interest) => {
                  const slugName = itemToSlugName(interest);
                  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slugName}`);
                  return (
                    <Label key={interest._id} as={Link} to={route} size="tiny">
                      <i className="fitted star"/> {interest.name}
                    </Label>
                  );
                })
                :
                <p style={marginBottomStyle}>No interests added yet.</p>
              }
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`)}>
                <p>View More Interests</p>
              </Link>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2}><p><b>Desired Academic Plan</b></p></Grid.Column>
            <Grid.Column width={6}>
              <p style={marginBottomStyle}>{desiredDegree}</p>
              <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`)}>
                View More Degrees
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <StudentShareInfoWidget profile={profile}/>
      </Container>
    </Segment>
  );
};

export default withRouter(withTracker((props) => ({
  profile: Users.getProfile(props.match.params.username),
}))(StudentAboutMeWidget));
