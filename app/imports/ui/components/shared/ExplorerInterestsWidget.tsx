import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Container, Header} from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { Interests } from "../../../api/interest/InterestCollection";
import BaseSlugCollection from '../../../api/base/BaseSlugCollection'

interface IExplorerInterestsWidgetProps {
  match: {
    isExact: boolean,
    path: string,
    url: string,
    params: {
      username: string;
      interest: string;
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

  /**
   * returns the doc of interest
   * @constructor
   */
  private GetInterestDoc = () => {
    console.log('get interest method', this.props.match.url);
    const splitUrl = this.props.match.url.split('/');
    console.log(splitUrl);
    const splitSlug = splitUrl[splitUrl.length-1];
    console.log(splitSlug);
    const interestIDFoundFromSlug = Interests.findIdBySlug(splitSlug);
    console.log('now find Interest from slug');
    console.log(Interests.findDocBySlug(splitSlug));

    //quick fix need to make method that converts this.props.match.params.interest to appropriate casing
    //console.log(Interests.findDoc(this.ConvertedInterestName(this.props.match.params.interest)));
    return (Interests.findDocBySlug(splitSlug));
    //Interests.findIdBySlug(slug)
  }
  


  public render() {
    const interestName = this.GetInterestDoc().name;
    const interestDescription = this.GetInterestDoc().description;
    return (
      <div className='ui paded container'>
        <div className="ui segments">
          <div className='ui padded segment container'>
            <Header>{interestName}</Header>
            {interestDescription}
          </div>

        </div>
      </div>
    );
  }
}

export default withRouter(ExplorerInterestsWidget);
