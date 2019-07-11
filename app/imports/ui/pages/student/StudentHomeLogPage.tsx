import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentLogWidget from '../../components/student/StudentLogWidget';

interface IStudentHomeLogPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentHomeLogPage extends React.Component<IStudentHomeLogPageProps> {
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
            <StudentLogWidget/>
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const StudentHomeLogPageCon = withGlobalSubscription(StudentHomeLogPage);
const StudentHomeLogPageContainer = withInstanceSubscriptions(StudentHomeLogPageCon);

export default StudentHomeLogPageContainer;
