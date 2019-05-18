import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import StudentFeedWidget from './StudentFeedWidget';
import StudentTeaserWidget from './StudentTeaserWidget';

interface IStudentHomeWidget {
  type?: string;
}

class StudentHomeWidget extends React.Component<IStudentHomeWidget> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
        <Grid>
          <Grid.Column width={10}>
            TODO: StudentOfInterestWidget, type=opportunities
            TODO: StudentOfInterestWidget, type=courses
          </Grid.Column>

          <Grid.Column width={6}>
            <StudentFeedWidget/>
            <StudentTeaserWidget/>
          </Grid.Column>
        </Grid>
    );
  }
}

export default StudentHomeWidget;
