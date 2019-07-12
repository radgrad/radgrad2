import * as React from 'react';
import * as _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Container, Grid, Segment, Header, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { buildRouteName, getUsername } from '../shared/RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import { ICareerGoal, IInterest, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import StudentAboutMeUpdatePictureForm from './StudentAboutMeUpdatePictureForm';
import StudentShareInfoWidget from './StudentShareInfoWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import StudentAboutMeUpdateWebsiteForm from './StudentAboutMeUpdateWebsiteForm';

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

class StudentAboutMeWidget extends React.Component<IStudentAboutMeWidgetProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = (): string => getUsername(this.props.match);

  private getProfile = (): IStudentProfile => this.props.profile;

  private getCollectionName = (): string => StudentProfiles.getCollectionName();

  private name = (): string => Users.getFullName(this.getUsername());

  private email = (): string => this.getProfile().username;

  private slugName = (item: { slugID: string }) => Slugs.findDoc(item.slugID).name;

  private careerGoals = (): ICareerGoal[] => {
    const ret = [];
    const profile = Users.getProfile(this.getUsername());
    _.forEach(profile.careerGoalIDs, (id) => {
      ret.push(CareerGoals.findDoc(id));
    });
    return ret;
  }

  private interests = (): IInterest[] => {
    const ret = [];
    const profile = Users.getProfile(this.getUsername());
    _.forEach(profile.interestIDs, (id) => {
      ret.push(Interests.findDoc(id));
    });
    return ret;
  }

  private desiredDegree = (): string => {
    let ret = 'Not yet specified.';
    const profile = Users.getProfile(this.getUsername());
    if (profile.academicPlanID) {
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      ret = plan.name;
    }
    return ret;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginBottomStyle = { marginBottom: 0 };

    const { match } = this.props;
    const name = this.name();
    const email = this.email();
    const careerGoals = this.careerGoals();
    const interests = this.interests();
    const desiredDegree = this.desiredDegree();
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
              <StudentAboutMeUpdatePictureForm username={this.getUsername()}
                                               picture={this.getProfile().picture}
                                               docID={this.getProfile()._id}
                                               collectionName={this.getCollectionName()}/>
              <StudentAboutMeUpdateWebsiteForm username={this.getUsername()}
                                               website={this.getProfile().website}
                                               docID={this.getProfile()._id}
                                               collectionName={this.getCollectionName()}/>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={2}><p><b>Career Goals</b></p></Grid.Column>
              <Grid.Column width={6}>
                {careerGoals ?
                  careerGoals.map((careerGoal) => {
                    const slugName = this.slugName(careerGoal);
                    const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slugName}`);
                    return (
                      <Label key={careerGoal._id} as={Link} to={route} size="tiny">
                        <i className="fitted suitcase"/> {careerGoal.name}
                      </Label>
                    );
                  })
                  :
                  <p style={marginBottomStyle}>No career goals added yet.</p>
                }
                <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`)}>
                  <br/>View More Career Goals
                </Link>
              </Grid.Column>

              <Grid.Column width={2}><p><b>Interests</b></p></Grid.Column>
              <Grid.Column width={6}>
                {interests ?
                  interests.map((interest) => {
                    const slugName = this.slugName(interest);
                    const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slugName}`);
                    return (
                      <Label key={interest._id} as={Link} to={route} size="tiny">
                        <i className="fitted star"/> {interest.name}
                      </Label>
                    );
                  })
                  :
                  <p style={marginBottomStyle}>No interests added yet.</p>
                }
                <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`)}>
                  <br/>View More Interests
                </Link>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={2}><p><b>Desired Academic Plan</b></p></Grid.Column>
              <Grid.Column width={6}>
                <p style={marginBottomStyle}>{desiredDegree}</p>
                <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`)}>
                  View More Degrees
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <StudentShareInfoWidget/>
        </Container>
      </Segment>
    );
  }
}

export default withRouter(withTracker((props) => ({
  profile: Users.getProfile(props.match.params.username),
}))(StudentAboutMeWidget));
