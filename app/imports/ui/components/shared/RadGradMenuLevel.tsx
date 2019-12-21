import * as React from 'react';

interface IRadGradMenuLevelProps {
  level: number;
}

const RadGradMenuLevel = (props: IRadGradMenuLevelProps) => {
  const iconName = `/images/level-icons/radgrad-level-${props.level}-icon.png`;
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
    <div style={iconStyle} />
  );
};

export default RadGradMenuLevel;
