import React from 'react';

interface RadGradLogoProps {
  instanceName: string;
  style?: any;
}

const RadGradLogoText: React.FC<RadGradLogoProps> = ({ instanceName, style = {} }) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  // eslint-disable-next-line no-param-reassign
  style.overflowWrap = 'anywhere';
  return (
    <div style={style}>
      {instanceName}&nbsp;
      <span className="radgrad-brand-font" style={radStyle}>
        RAD
      </span>
      <span className="radgrad-brand-font" style={gradStyle}>
        GRAD
      </span>
    </div>
  );
};

export default RadGradLogoText;
