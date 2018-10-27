import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Ice } from '../../../typings/radgrad';
import RadGradMenuLevel from './RadGradMenuLevel';

interface IRadGradMenuProfileProps {
  displayLevelAndIce: boolean;
  level?: number;
  earnedICE?: Ice;
  projectedICE?: Ice;
}
class RadGradMenuProfile extends React.Component<IRadGradMenuProfileProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        {this.props.displayLevelAndIce === true ? (
          <div>
            <RadGradMenuLevel level={this.props.level}/>
          </div>
        ) : ''}
      </div>
    );
  }
}
