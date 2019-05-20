//@qauchida
//05/20/19
//Faculty Widget that shows About Me information
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FacultyProfiles} from "../../../api/user/FacultyProfileCollection";

interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params:{
      username:string;
    }
  }
}

class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  public render() {
    const username = this.props.match.params.username;
    const faculty = FacultyProfiles.findDoc(username);
    console.log(faculty);
    return (
      <div>return the contents of the doc here</div>
    );
  }

}

export default withRouter(FacultyPageAboutMeWidget);
