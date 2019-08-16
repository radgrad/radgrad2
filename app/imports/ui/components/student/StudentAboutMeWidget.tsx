import * as React from 'react';
import * as _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Container, Grid, Segment, Header, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { buildRouteName, getUsername } from '../shared/RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import {
  ICareerGoal, IFavoriteAcademicPlan, // eslint-disable-line
  IFavoriteCareerGoal, // eslint-disable-line
  IFavoriteInterest, // eslint-disable-line
  IInterest, // eslint-disable-line
  IStudentProfile // eslint-disable-line
} from '../../../typings/radgrad'; // eslint-disable-line
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import StudentAboutMeUpdatePictureForm from './StudentAboutMeUpdatePictureForm';
import StudentShareInfoWidget from './StudentShareInfoWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import StudentAboutMeUpdateWebsiteForm from './StudentAboutMeUpdateWebsiteForm';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';

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
  favoriteCareerGoals: IFavoriteCareerGoal[];
  favoriteInterests: IFavoriteInterest[];
  favoriteAcademicPlans: IFavoriteAcademicPlan[];
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginBottomStyle = { marginBottom: 0 };
    console.log(this.props);
    const { match, profile } = this.props;
    const name = this.name();
    const email = this.email();
    const careerGoals = _.map(this.props.favoriteCareerGoals, (f) => CareerGoals.findDoc(f.careerGoalID));
    const interests = _.map(this.props.favoriteInterests, (f) => Interests.findDoc(f.interestID));
    const academicPlans = _.map(this.props.favoriteAcademicPlans, (f) => AcademicPlans.findDoc(f.academicPlanID));
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
              <StudentAboutMeUpdatePictureForm picture={this.getProfile().picture}
                                               docID={this.getProfile()._id}
                                               collectionName={this.getCollectionName()}/>
              <StudentAboutMeUpdateWebsiteForm website={this.getProfile().website}
                                               docID={this.getProfile()._id}
                                               collectionName={this.getCollectionName()}/>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={2}><p><b>My Favorite Career Goals</b></p></Grid.Column>
              <Grid.Column width={6}>
                {careerGoals.length !== 0 ?
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
                  <p style={marginBottomStyle}>No career goals favorited yet.</p>
                }
                <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`)}>
                  <p>Update in career goal explorer</p>
                </Link>
              </Grid.Column>

              <Grid.Column width={2}><p><b>My Favorite Interests</b></p></Grid.Column>
              <Grid.Column width={6}>
                {interests.length !== 0 ?
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
                  <p style={marginBottomStyle}>No interests favorited yet.</p>
                }
                <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`)}>
                  <p>Update in interest explorer</p>
                </Link>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={2}><p><b>My Favorite Academic Plan</b></p></Grid.Column>
              <Grid.Column width={6}>
                {academicPlans.length !== 0 ?
                  academicPlans.map((plan) => {
                    const slugName = this.slugName(plan);
                    const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${slugName}`);
                    return (
                      <Label key={plan._id} as={Link} to={route} size="tiny">
                        <i className="fitted map outline"/> {plan.name}
                      </Label>
                    );
                  })
                  :
                  <p style={marginBottomStyle}>No academic plans favorited yet.</p>
                }
                <Link to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`)}>
                  Update in academic plan explorer
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <StudentShareInfoWidget profile={profile}/>
        </Container>
      </Segment>
    );
  }
}

export default withRouter(withTracker((props) => ({
  profile: Users.getProfile(props.match.params.username),
  favoriteAcademicPlans: FavoriteAcademicPlans.findNonRetired({}),
  favoriteCareerGoals: FavoriteCareerGoals.findNonRetired({}),
  favoriteInterests: FavoriteInterests.findNonRetired({}),
}))(StudentAboutMeWidget));
