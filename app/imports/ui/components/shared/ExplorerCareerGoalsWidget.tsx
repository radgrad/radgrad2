import * as React from 'react';
import { Grid, Segment, Header, Button, Divider } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
// eslint-disable-next-line no-unused-vars
// import { IDesiredDegree } from '../../../typings/radgrad';
// import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IExplorerCareerGoalsWidgetProps {
  // desiredDegrees: IDesiredDegree;
}

class ExplorerCareerGoalsWidget extends React.Component<IExplorerCareerGoalsWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginStyle = {
      marginTop: 5,
    };

    const divPadding = {
      marginTop: 0,
    };
    return (
      <Grid container={true} stackable={true} style={marginStyle}>
        <Grid.Column width={16}>
          <Segment>
            <Segment basic clearing={true} vertical>
              <Grid.Row verticalAlign={'middle'}>
                <Button size={'mini'} color={'green'} floated={'right'} basic={true}>ADD TO CAREER GOALS</Button>
                <Header floated={'left'}>Test</Header>
              </Grid.Row>
            </Segment>
            <Divider style={divPadding}/>
            <Grid.Column stackable={true}>
              Description.
            </Grid.Column>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const ExplorerCareerGoalsWidgetCon = withGlobalSubscription(ExplorerCareerGoalsWidget);
const ExplorerCareerGoalsWidgetContainer = withInstanceSubscriptions(ExplorerCareerGoalsWidgetCon);

export default ExplorerCareerGoalsWidgetContainer;
