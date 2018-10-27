import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Ice } from '../../../typings/radgrad';
import { Header, Image, Loader } from 'semantic-ui-react';
import RadGradMenuLevel from './RadGradMenuLevel';

import { Users } from '../../../api/user/UserCollection';

interface IRadGradMenuProfileProps {
  userProfile?: any;
  displayLevelAndIce: boolean;
  level?: number;
  earnedICE?: Ice;
  projectedICE?: Ice;
  ready?: boolean;
}

class RadGradMenuProfile extends React.Component<IRadGradMenuProfileProps, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    const divStyle = { borderLeft: '1px solid rgba(34,36,38,.07)', paddingTop: '5px' };
    const imageStyle = { width: '50px', borderRadius: '2px' };
    const nameStyle = { lineHeight: '20px', paddingLeft: '10px' };
    const pictureSrc = (this.props.userProfile.picture) ? this.props.userProfile.picture : '/images/default-profile-picture.png';
    return (
      <div>
        {this.props.displayLevelAndIce === true ? (
          <div>
            <RadGradMenuLevel level={this.props.level}/>
          </div>
        ) : ''}
        <div className="mobile hidden item radgrad-menu-profile radgrad-brand-font" style={divStyle}>
          <Image src={pictureSrc} style={imageStyle}/>
          <Header style={nameStyle}><span>{this.props.userProfile.firstName}<br/>{this.props.userProfile.lastName}</span>
          </Header>
        </div>
      </div>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Users.subscribe();
  const userId = Meteor.userId();
  return {
    ready: subscription.ready(),
    userProfile: Users.getProfile(userId),
  };
})(RadGradMenuProfile);
