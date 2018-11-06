import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Ice } from '../../../typings/radgrad';
import { Header, Image, Loader } from 'semantic-ui-react';
import RadGradMenuLevel from './RadGradMenuLevel';

import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import MenuIceCircle from './MenuIceCircle';

interface IRadGradMenuProfileProps {
  userProfile?: any;
  displayLevelAndIce?: boolean;
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
    const flexStyle = { display: 'flex', paddingTop: '5px', paddingRight: '13px',  marginTop: '3px' };
    const imageStyle = { width: '50px', borderRadius: '2px' };
    const nameStyle = { lineHeight: '20px', paddingLeft: '10px', marginTop: '0px' };
    const pictureSrc = (this.props.userProfile.picture) ? this.props.userProfile.picture : '/images/default-profile-picture.png';
    return (
      <div style={flexStyle}>
        {this.props.displayLevelAndIce ? (
          <div style={flexStyle}>
            <RadGradMenuLevel level={this.props.level}/>
            <MenuIceCircle earned={this.props.earnedICE.i} planned={this.props.projectedICE.i} type="innov"/>
            <MenuIceCircle earned={this.props.earnedICE.c} planned={this.props.projectedICE.c} type="comp"/>
            <MenuIceCircle earned={this.props.earnedICE.e} planned={this.props.projectedICE.e} type="exp"/>
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
  const profile = Users.getProfile(userId);
  const level = profile.level;
  let earnedICE;
  let projectedICE;
  let displayLevelAndIce = false;
  if (Roles.userIsInRole(userId, [ROLE.STUDENT])) {
    displayLevelAndIce = true;
    earnedICE = StudentProfiles.getEarnedICE(userId);
    projectedICE = StudentProfiles.getProjectedICE(userId);
  }
  return {
    ready: subscription.ready(),
    userProfile: profile,
    displayLevelAndIce,
    level,
    earnedICE,
    projectedICE,
  };
})(RadGradMenuProfile);
