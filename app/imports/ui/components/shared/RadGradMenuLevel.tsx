import React from 'react';
import { Popup } from 'semantic-ui-react';

interface RadGradMenuLevelProps {
  level: number;
}

const RadGradMenuLevel: React.FC<RadGradMenuLevelProps> = ({ level }) => {
  const iconName = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const iconStyle = {
    backgroundImage: `url('${iconName}'`,
    backgroundRepeat: 'no-prepeat',
    width: '50px',
    height: '50px',
    margin: '0px 5px 0 0',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundSize: '100% 100%',
    display: 'flex',
  };
  return (
    <Popup trigger={<div style={iconStyle}/>} content={`Level ${level}`}/>
  );
};

export default RadGradMenuLevel;
