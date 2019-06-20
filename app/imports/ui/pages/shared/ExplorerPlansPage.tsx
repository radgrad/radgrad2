import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../components/shared/ExplorerMenu';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import ExplorerPlansWidget from '../../components/shared/ExplorerPlansWidget';

interface IExplorerPlansPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      plan: string;
    }
  };
}

class ExplorerPlansPage extends React.Component<IExplorerPlansPageProps> {
  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = (): JSX.Element | string => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return '';
    }
  }

  /* ####################################### EXPLORER MENU HELPER FUNCTIONS ######################################### */
  private getUsername = (): string => this.props.match.params.username;

  private addedPlans = (): { item: IAcademicPlan, count: number }[] => {
    const profile = Users.getProfile(this.getUsername());
    if (profile.academicPlanID) {
      return [{ item: AcademicPlans.findDoc(profile.academicPlanID), count: 1 }];
    }
    return [];
  }

  /* ####################################### EXPLORER PLANS WIDGET HELPER FUNCTIONS ############################### */

  private plan() {
    const planSlugName = this.props.match.params.plan;
    const slug = Slugs.findDoc({ name: planSlugName });
    return AcademicPlans.findDoc({ slugID: slug._id });
  }

  private descriptionPairs = (plan: IAcademicPlan): object[] => {
    const degree = DesiredDegrees.findDoc(plan.degreeID);
    const description = `${degree.description}\n\n${plan.description}`;
    return [
      { label: 'Description', value: description },
    ];
  }

  private getUserIdFromRoute = (): string => {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const helpMessage = HelpMessages.findOne({ routeName: this.props.match.path });

    const addedList = this.addedPlans();

    const plan = this.plan();
    const name = plan.name;
    const descriptionPairs = this.descriptionPairs(plan);
    const id = plan._id;

    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}

        <Grid container={true} stackable={true}>
          <Grid.Row>
            {helpMessage ? <HelpPanelWidget/> : ''}
          </Grid.Row>

          <Grid.Column width={3}>
            <ExplorerMenu menuAddedList={addedList} type={'plans'} role={this.getRoleByUrl()}/>
          </Grid.Column>

          <Grid.Column width={13}>
            <ExplorerPlansWidget name={name} descriptionPairs={descriptionPairs} id={id} item={plan}
                                 role={this.getRoleByUrl()}/>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const ExplorerPlansPageCon = withGlobalSubscription(ExplorerPlansPage);
const ExplorerPlansPageContainer = withInstanceSubscriptions(ExplorerPlansPageCon);

export default ExplorerPlansPageContainer;
