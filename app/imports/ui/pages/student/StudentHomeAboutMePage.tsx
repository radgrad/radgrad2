import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentAboutMeWidget from '../../components/student/StudentAboutMeWidget';

class StudentHomeAboutMePage extends React.Component {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
              <StudentHomeMenu/>
            </Grid.Column>

            <Grid.Column width={11} stretched={true}>
              <StudentAboutMeWidget/>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const StudentHomeAboutMePageCon = withGlobalSubscription(StudentHomeAboutMePage);
const StudentHomeAboutMePageContainer = withInstanceSubscriptions(StudentHomeAboutMePageCon);

export default StudentHomeAboutMePageContainer;
