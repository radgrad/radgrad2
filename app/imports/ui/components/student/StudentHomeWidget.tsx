import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import StudentFeedWidget from './StudentFeedWidget';
import StudentTeaserWidget from './StudentTeaserWidget';
import StudentOfInterestWidget from './StudentOfInterestWidget';

class StudentHomeWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Grid centered={true} stackable={true}>
        <Grid.Column width={10}>
          <StudentOfInterestWidget type="opportunities"/>
          <StudentOfInterestWidget type="courses"/>
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
