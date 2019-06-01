import * as React from 'react';
import { Card, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import * as _ from 'lodash';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

interface ICardExplorerWidgetProps {
  collection: any;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty' | 'mentor';
  username: string;
  reactiveSource: object[];
}

class CardExplorerWidget extends React.Component<ICardExplorerWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### HEADER FUNCTIONS ####################################### */
  private getHeaderTitle = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return 'ACADEMIC PLANS';
      case 'career-goals':
        return 'CAREER GOALS';
      default:
        return 'UNDEFINED TITLE';
    }
  }

  private getHeaderCount = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.academicPlansItemCount();
      case 'career-goals':
        return this.careerGoalsItemCount();
      default:
        return -1;
    }
  }

  private buildHeader = () => {
    const header = {
      title: this.getHeaderTitle(),
      count: this.getHeaderCount(),
    };
    return header;
  }

  private checkForNoItems = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.noItems('noPlan') ? this.buildNoItemsMessage('noPlan') : '';
      case 'career-goals':
        return <React.Fragment>
          {this.noItems('noInterests') ? this.buildNoItemsMessage('noInterests') : ''}
          {this.noItems('noCareerGoals') ? this.buildNoItemsMessage('noCareerGoals') : ''}
        </React.Fragment>;
      default:
        return '';

    }
  }
  private noItems = (noItemsType) => {
    switch (noItemsType) {
      case 'noPlan':
        return this.noPlan();
      case 'noInterests':
        return this.noInterests;
      case 'noCareerGoals':
        return this.noCareerGoals;
      default:
        return true;
    }
  }

  private buildNoItemsMessage = (noItemsType) => {
    switch (noItemsType) {
      case 'noPlan':
        return <p>You have no Academic Plan, select add to profile to select a plan.</p>;
      case 'noInterests':
        return <p>Add interests to see sorted careers. To add interests, select &quot;Interests&quot; in the pull-down
          menu on the
          left.</p>;
      case 'noCareerGoals':
        return <p>You have no Career Goals, select &quot;Add to Profile&quot; to add a career goal.</p>;
      default:
        return '';
    }
  }
  /* ####################################### GENERAL HELPER FUNCTIONS ####################################### */
  private isRoleStudent = () => this.props.role === 'student'

  private getUsername = () => this.props.username

  private getItems = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.availableAcademicPlans();
      case 'career-goals':
        return this.matchingCareerGoals();
      default:
        return undefined;
    }
  }

  /* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
  private noPlan = () => {
    if (this.isRoleStudent()) {
      if (this.getUsername()) {
        return _.isNil(Users.getProfile(this.props.username).academicPlanID);
      }
    }
    return false;
  }

  private availableAcademicPlans = () => {
    let plans = AcademicPlans.findNonRetired({}, { sort: { year: 1, name: 1 } });
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      if (!profile.declaredAcademicTermID) {
        plans = AcademicPlans.getLatestPlans();
      } else {
        const declaredTerm = AcademicTerms.findDoc(profile.declaredAcademicTermID);
        plans = _.filter(AcademicPlans.find({ termNumber: { $gte: declaredTerm.termNumber } }, {
          sort: {
            year: 1,
            name: 1,
          },
        }).fetch(), (ap) => !ap.retired);
      }
      if (profile.academicPlanID) {
        return _.filter(plans, p => profile.academicPlanID !== p._id);
      }
    }
    console.log(plans);
    return plans;
  }

  private academicPlansItemCount = () => this.availableAcademicPlans().length

  /* ####################################### CAREER GOALS HELPER FUNCTIONS ####################################### */
  private availableCareerGoals = () => {
    const careers = CareerGoals.find({}).fetch();
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const careerGoalIDs = profile.careerGoalIDs;
      return _.filter(careers, c => !_.includes(careerGoalIDs, c._id));
    }
    return careers;
  }

  private matchingCareerGoals() {
    const allCareers = this.availableCareerGoals();
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const interestIDs = Users.getInterestIDs(profile.userID);
      const preferred = new PreferredChoice(allCareers, interestIDs);
      return preferred.getOrderedChoices();
    }
    return allCareers;
  }

  private careerGoalsItemCount = () => this.matchingCareerGoals().length;

  private noInterests = () => {
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const interestIDs = Users.getInterestIDs(profile.userID);
      return interestIDs.length === 0;
    }
    return true;
  }

  private noCareerGoals = () => {
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      return profile.careerGoalIDs.length === 0;
    }
    return true;
  }

  /* ####################################### COURSES HELPER FUNCTIONS ####################################### */

  /* ####################################### DEGREES HELPER FUNCTIONS ####################################### */

  /* ####################################### INTERESTS HELPER FUNCTIONS ####################################### */

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ####################################### */

  /* ####################################### USERS HELPER FUNCTIONS ####################################### */

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    /* Styles */
    const headerStyle: React.CSSProperties = { textTransform: 'uppercase' };
    const cardGroupStyle: React.CSSProperties = {
      maxHeight: '750px',
      overflowX: 'hidden',
      overflowY: 'scroll',
      marginTop: '10px',
    };

    /* Variables */
    const header = this.buildHeader(); // The header Title and Count
    const items = this.getItems(); // The items to map over

    return (
      <React.Fragment>
        <Segment padded={true}>
          <Header dividing={true}>
            <h4>
              <span style={headerStyle}>{header.title} </span><WidgetHeaderNumber inputValue={header.count}/>
            </h4>
          </Header>

          {this.checkForNoItems()}

          <Card.Group style={cardGroupStyle} itemsPerRow={2} stackable={true}>
            {}
          </Card.Group>
        </Segment>

        {/* TODO: Add Back To Top Button. I'm not sure if we should put this in the Widget level or the Page level.
              It is currently on the widget level on the original radgrad but it doesn't even appear properly.
              It seems to only appear if you have Google Chrome DevTools window active. - Gian */}
      </React.Fragment>
    );
  }
}

const CardExplorerWidgetContainer = withTracker((props) => {
  const { collection } = props;
  const reactiveSource = collection.findNonRetired();

  return {
    reactiveSource,
  };
})(CardExplorerWidget);
export default CardExplorerWidgetContainer;
