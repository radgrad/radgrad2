import React from 'react';
import { Header, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradMenuLevel from './RadGradMenuLevel';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import MenuIceCircle from './MenuIceCircle';
// eslint-disable-next-line no-unused-vars
import { Ice, IStudentProfile } from '../../../typings/radgrad';
import { radgradMenuProfile } from './shared-widget-names';

interface IRadGradMenuProfileProps {
  userName: string;
  profile: IStudentProfile;
  displayLevelAndIce: boolean;
  earnedICE: Ice;
  projectedICE: Ice;
}

const RadGradMenuProfile = (props: IRadGradMenuProfileProps) => {
  const { profile, displayLevelAndIce, earnedICE, projectedICE } = props;

  const level = profile.level;
  const divStyle = { borderLeft: '1px solid rgba(34,36,38,.07)', paddingTop: '5px' };
  const flexStyle = { display: 'flex', paddingTop: '5px', paddingRight: '13px', marginTop: '3px' };
  const imageStyle = { width: '50px', borderRadius: '2px' };
  const nameStyle = { lineHeight: '20px', paddingLeft: '10px', marginTop: '0px' };
  const pictureSrc = (profile.picture) ? profile.picture : '/images/default-profile-picture.png';
  return (
    <div style={flexStyle} id={`${radgradMenuProfile}`}>
      {displayLevelAndIce ? (
        <div style={flexStyle}>
          <RadGradMenuLevel level={level} />
          <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
          <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
          <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
        </div>
      ) : ''}
      <div className="mobile hidden item radgrad-menu-profile radgrad-brand-font" style={divStyle}>
        <Image src={pictureSrc} style={imageStyle} />
        <Header style={nameStyle}>
          <span>
            {profile.firstName}
            <br />
            {profile.lastName}
          </span>
        </Header>
      </div>
    </div>
  );
};

const RadGradMenuProfileContainer = withTracker((props) => {
  const profile = Users.getProfile(props.userName);
  const displayLevelAndIce = profile.role === ROLE.STUDENT;
  // console.log('profile %o userIsInRole %o', profile, displayLevelAndIce);
  let earnedICE;
  let projectedICE;
  if (displayLevelAndIce) {
    earnedICE = StudentProfiles.getEarnedICE(props.userName);
    projectedICE = StudentProfiles.getProjectedICE(props.userName);
  }

  return {
    profile,
    displayLevelAndIce,
    earnedICE,
    projectedICE,
  };
})(RadGradMenuProfile);
export default RadGradMenuProfileContainer;
