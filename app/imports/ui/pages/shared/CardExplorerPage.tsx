import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import CardExplorerWidget from '../../components/shared/CardExplorerWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';

interface ICardExplorerPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class CardExplorerPage extends React.Component<ICardExplorerPageProps> {
  constructor(props) {
    super(props);
  }

  private getType = () => {
    const url = this.props.match.url;
    const index = url.lastIndexOf('/');
    return url.substr(index + 1);
  }

  private getCollection = () => {
    const type = this.getType();
    switch (type) {
      case 'plans':
        return AcademicPlans;
      case 'career-goals':
        return CareerGoals;
      case 'courses':
        return Courses;
      case 'degrees':
        return DesiredDegrees;
      case 'interests':
        return Interests;
      case 'opportunities':
        return Opportunities;
      case 'users':
        return Users;
      default:
        return {};
    }
  }
  private getRoleByUrl = () => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = () => {
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <React.Fragment>
        {
          this.renderPageMenuWidget()
        }

        <Grid container={true} stackable={true}>
          <Grid.Row width={3}>
            {/*  TODO: Card_Explorer_Menu */}
          </Grid.Row>

          <Grid.Row width={13}>
            <CardExplorerWidget collection={this.getCollection()} type={this.getType()}/>
          </Grid.Row>
        </Grid>

      </React.Fragment>
    );
  }
}

const CardExplorerPageCon = withGlobalSubscription(CardExplorerPage);
const CardExplorerPageCont = withInstanceSubscriptions(CardExplorerPageCon);
const CardExplorerPageContainer = withRouter(CardExplorerPageCont);

export default CardExplorerPageContainer;
