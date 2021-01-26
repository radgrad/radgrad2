import React from 'react';
import { Image } from 'semantic-ui-react';
import RadGradMenuLevel from './RadGradMenuLevel';
import MenuIceCircle from './MenuIceCircle';
import { BaseProfile, Ice } from '../../../typings/radgrad';

export interface RadGradMenuProfileProps {
  profile: BaseProfile;
  displayLevelAndIce: boolean;
  earnedICE?: Ice;
  projectedICE?: Ice;
}

const RadGradMenuProfile: React.FC<RadGradMenuProfileProps> = ({ profile, displayLevelAndIce, earnedICE, projectedICE }) => {
  const level = profile.level;
  const divStyle = { borderLeft: '1px solid rgba(34,36,38,.07)', paddingTop: '5px' };
  const flexStyle = { display: 'flex', paddingTop: '5px', paddingRight: '13px', marginTop: '3px' };
  const imageStyle = { width: '50px', borderRadius: '2px' };
  // const nameStyle = { lineHeight: '20px', paddingLeft: '10px', marginTop: '0px' };
  const pictureSrc = profile.picture ? profile.picture : '/images/default-profile-picture.png';
  return (
    <div style={flexStyle} id="radgradMenuProfile">
      {displayLevelAndIce ? (
        <div style={flexStyle}>
          <RadGradMenuLevel level={level} />
          <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
          <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
          <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
        </div>
      ) : (
        ''
      )}
      <div className="mobile hidden item radgrad-menu-profile radgrad-brand-font" style={divStyle}>
        <Image src={pictureSrc} style={imageStyle} />
      </div>
    </div>
  );
};

export default RadGradMenuProfile;
