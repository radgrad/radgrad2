import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentLevelsWidget from '../../components/student/StudentLevelsWidget';
import StudentLevelsOthersWidget from '../../components/student/StudentLevelsOthersWidget';

class StudentHomeLevelsPage extends React.Component {
  public render() {
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

          <Grid.Column width={14}>
            <Grid container={true} stackable={true} columns="equal">
              <Grid.Column stretched={true}>
                <StudentLevelsWidget/>
              </Grid.Column>

              <Grid.Column stretched={true}>
                <StudentLevelsOthersWidget/>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const StudentHomeLevelsPageCon = withGlobalSubscription(StudentHomeLevelsPage);
const StudentHomeLevelsPageContainer = withInstanceSubscriptions(StudentHomeLevelsPageCon);

export default StudentHomeLevelsPageContainer;
