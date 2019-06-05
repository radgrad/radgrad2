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

  private descriptionPairs = (careerGoal) => [
    { label: 'Description', value: careerGoal.description },
    { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
  ]

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginStyle = {
      marginTop: 5,
    };
    const careerGoal = this.careerGoal();
    console.log('careerGoal: ', careerGoal);
    const careerName = careerGoal.name;
    const slugName = careerGoal.slugID;
    const descriptionPairs = this.descriptionPairs(careerGoal);
    return (
      <Grid container={true} stackable={true} style={marginStyle}>
        <Grid.Column width={3}>
          {/*  TODO: Card Explorer Menu */}
        </Grid.Column>

        <Grid.Column width={13}>
          <ExplorerCareerGoalsWidgetContainer name={careerName} slug={slugName} descriptionPairs={descriptionPairs} item={careerGoal}/>
        </Grid.Column>
      </Grid>
    );
  }
}

const ExplorerCareerGoalsPageCon = withGlobalSubscription(ExplorerCareerGoalsPage);
const ExplorerCareerGoalsPageContainer = withInstanceSubscriptions(ExplorerCareerGoalsPageCon);

export default withRouter(ExplorerCareerGoalsPageContainer);
