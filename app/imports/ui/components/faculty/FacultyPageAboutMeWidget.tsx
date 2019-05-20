//@qauchida
//05/20/19
//Faculty Widget that shows About Me information
import * as React from 'react';
import {withRouter} from 'react-router-dom';

interface IFacultyPageAboutMeWidgetProps {
  match?: {}
}

class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  public render() {
    //need to show demographic information
    return (
      <div>Put the About Me content in here</div>
    );
  }

}

export default withRouter(FacultyPageAboutMeWidget);
