import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentIceWidget from '../../components/student/StudentIceWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';

class StudentHomeIcePage extends React.Component {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={2}>
            <StudentHomeMenu/>
          </Grid.Column>

          <Grid.Column width={14} stretched={true}>
            <StudentIceWidget/>
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const StudentHomeIcePageCon = withGlobalSubscription(StudentHomeIcePage);
const StudentHomeIcePageContainer = withInstanceSubscriptions(StudentHomeIcePageCon);

export default StudentHomeIcePageContainer;
