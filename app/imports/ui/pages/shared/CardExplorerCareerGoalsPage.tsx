import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
// eslint-disable-next-line no-unused-vars
// import { IDesiredDegree } from '../../../typings/radgrad';
// import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface ICardExplorerCareerGoalsPageProps {
  // desiredDegrees: IDesiredDegree;
}

class CardExplorerCareerGoalsPage extends React.Component<ICardExplorerCareerGoalsPageProps> {
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

const CardExplorerCareerGoalsPageCon = withGlobalSubscription(CardExplorerCareerGoalsPage);
const CardExplorerCareerGoalsPageContainer = withInstanceSubscriptions(CardExplorerCareerGoalsPageCon);

export default CardExplorerCareerGoalsPageContainer;
