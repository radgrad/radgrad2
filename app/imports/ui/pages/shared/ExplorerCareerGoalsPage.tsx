import * as React from 'react';
import * as _ from 'lodash';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import ExplorerCareerGoalsWidgetContainer from '../../components/shared/ExplorerCareerGoalsWidget';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';

interface IExplorerCareerGoalsPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      careergoal: string;
    }
  };
}

class ExplorerCareerGoalsPage extends React.Component<IExplorerCareerGoalsPageProps> {
  constructor(props) {
    super(props);
  }

  private careerGoal = () => {
    const careerGoalSlugName = this.props.match.params.careergoal;
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const careerGoal = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return careerGoal[0];
  }

  private interestedUsers = (careerGoal, role) => {
    const interested = [];
    const profiles = Users.findProfilesWithRole(role, {}, {});
    _.forEach(profiles, (profile) => {
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        interested.push(profile);
      }
    });
    return interested;
  }

  private numUsers = (careerGoal, role) => this.interestedUsers(careerGoal, role).length

  private getUserIdFromRoute() {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  private socialPairs = (careerGoal) => [
    {
      label: 'students', amount: this.numUsers(careerGoal, ROLE.STUDENT),
      value: this.interestedUsers(careerGoal, ROLE.STUDENT),
    },
    {
      label: 'faculty members', amount: this.numUsers(careerGoal, ROLE.FACULTY),
      value: this.interestedUsers(careerGoal, ROLE.FACULTY),
    },
    {
      label: 'alumni',
      amount: this.numUsers(careerGoal, ROLE.ALUMNI),
      value: this.interestedUsers(careerGoal, ROLE.ALUMNI),
    },
    {
      label: 'mentors',
      amount: this.numUsers(careerGoal, ROLE.MENTOR),
      value: this.interestedUsers(careerGoal, ROLE.MENTOR),
    },
  ]

  private descriptionPairs = (careerGoal) => [
    { label: 'Description', value: careerGoal.description },
    { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
  ]

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginStyle = {
      marginTop: 5,
    };
    const careerGoal = this.careerGoal();
    const username = this.props.match.params.username;
    const careerName = careerGoal.name;
    const slugName = careerGoal.slugID;
    const socialPairs = this.socialPairs(careerGoal);
    const descriptionPairs = this.descriptionPairs(careerGoal);
    return (
      <Grid container={true} stackable={true} style={marginStyle}>
        <Grid.Column width={3}>
          {/*  TODO: Card Explorer Menu */}
        </Grid.Column>

        <Grid.Column width={13}>
          <ExplorerCareerGoalsWidgetContainer name={careerName} slug={slugName} descriptionPairs={descriptionPairs}
                                              item={careerGoal} socialPairs={socialPairs} id={careerGoal._id}
                                              username={username} careerGoal={careerGoal}/>
        </Grid.Column>
      </Grid>
    );
  }
}

const ExplorerCareerGoalsPageCon = withGlobalSubscription(ExplorerCareerGoalsPage);
const ExplorerCareerGoalsPageContainer = withInstanceSubscriptions(ExplorerCareerGoalsPageCon);

export default withRouter(ExplorerCareerGoalsPageContainer);
