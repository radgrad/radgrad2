import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Container, Header} from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import {Interests} from "../../../api/interest/InterestCollection";

interface IExplorerInterestsWidgetProps {
  match: {
    isExact: boolean,
    path: string,
    url: string,
    params: {
      username: string;
      interest: string;
      _id: string;
    }
  }
};

// don't know if we'll need this because state may not change
interface IExplorerInterestsWidgetState {

}

class ExplorerInterestsWidget extends React.Component <IExplorerInterestsWidgetProps, IExplorerInterestsWidgetState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }


  private getInterest = () => {
    console.log(this.props.match);
  }


  public render() {
    return (
      <div className='ui paded container'>
        <div className="ui segments">
          <div className='ui padded segment container'>
            <Header>The Interest Name should go here</Header>
            {this.getInterest()}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ExplorerInterestsWidget);
