import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import CardExplorerDegreesWidget from '../../components/shared/CardExplorerDegreesWidget';
// eslint-disable-next-line no-unused-vars
import { IDesiredDegree } from '../../../typings/radgrad';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IExplorerDegreesPageProps {
  desiredDegrees: IDesiredDegree;
}

class ExplorerDegreesPage extends React.Component<IExplorerDegreesPageProps> {
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
          <CardExplorerDegreesWidget collection={DesiredDegrees}/>
        </Grid.Row>
      </Grid>
    );
  }
}

const ExplorerDegreesPageCon = withGlobalSubscription(ExplorerDegreesPage);
const ExplorerDegreesPageContainer = withInstanceSubscriptions(ExplorerDegreesPageCon);

export default ExplorerDegreesPageContainer;
