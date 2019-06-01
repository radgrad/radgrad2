import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
// eslint-disable-next-line no-unused-vars
// import { IDesiredDegree } from '../../../typings/radgrad';
// import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IExplorerCareerGoalsPageProps {
  // desiredDegrees: IDesiredDegree;
}

class ExplorerCareerGoalsPage extends React.Component<IExplorerCareerGoalsPageProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Grid container={true} stackable={true}>
        <Grid.Row width={3}>
          {/*  TODO: Card Explorer Menu */}
        </Grid.Row>

        <Grid.Row width={13}>
          <p>test</p>
        </Grid.Row>
      </Grid>
    );
  }
}

const ExplorerCareerGoalsPageCon = withGlobalSubscription(ExplorerCareerGoalsPage);
const ExplorerCareerGoalsPageContainer = withInstanceSubscriptions(ExplorerCareerGoalsPageCon);

export default ExplorerCareerGoalsPageContainer;
