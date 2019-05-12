import * as React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Header, Image } from 'semantic-ui-react';
import RadGradMenuLevel from './RadGradMenuLevel';

import { Users } from '../../../api/user/UserCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import MenuIceCircle from './MenuIceCircle';

interface IRadGradMenuProfileProps {
  userName: string;
}

class RadGradMenuProfile extends React.Component<IRadGradMenuProfileProps, {}> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const profile = Users.getProfile(this.props.userName);
    // console.log(profile);
    const displayLevelAndIce = Roles.userIsInRole(profile.userID, [ROLE.STUDENT]);
    let earnedICE;
    let projectedICE;
    if (displayLevelAndIce) {
      earnedICE = StudentProfiles.getEarnedICE(this.props.userName);
      projectedICE = StudentProfiles.getProjectedICE(this.props.userName);
    }
    const level = profile.level;
    // console.log(displayLevelAndIce);
    const divStyle = { borderLeft: '1px solid rgba(34,36,38,.07)', paddingTop: '5px' };
    const flexStyle = { display: 'flex', paddingTop: '5px', paddingRight: '13px', marginTop: '3px' };
    const imageStyle = { width: '50px', borderRadius: '2px' };
    const nameStyle = { lineHeight: '20px', paddingLeft: '10px', marginTop: '0px' };
    const pictureSrc = (profile.picture) ? profile.picture : '/images/default-profile-picture.png';
    return (
      <div style={flexStyle}>
        {displayLevelAndIce ? (
          <div style={flexStyle}>
            <RadGradMenuLevel level={level}/>
            <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov"/>
            <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp"/>
            <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp"/>
          </div>
        ) : ''}
        <div className="mobile hidden item radgrad-menu-profile radgrad-brand-font" style={divStyle}>
          <Image src={pictureSrc} style={imageStyle}/>
          <Header style={nameStyle}><span>{profile.firstName}<br/>{profile.lastName}</span>
          </Header>
        </div>
      </div>
    );
  }
}

export default RadGradMenuProfile;
